const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  ffmpegPath = null;
}

function resolveFfmpegBinary(isPackaged, resourcesPath) {
  if (isPackaged && resourcesPath) {
    const unpacked = path.join(
      resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      'ffmpeg-static',
      process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
    );
    if (fs.existsSync(unpacked)) {
      return unpacked;
    }
  }
  return ffmpegPath || (process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
}

// Media extensions natively decoded by modern Chromium/Electron without transcoding
const DIRECT_PLAY_EXTS = new Set([
  '.mp4',
  '.m4v',
  '.webm',
  '.mp3',
  '.wav',
  '.ogg',
  '.flac',
  '.aac',
  '.m4a',
  '.opus'
]);

// Audio extensions that can be transcoded directly to high-bitrate AAC/ADTS
const AUDIO_EXTS = new Set([
  '.mp3',
  '.wav',
  '.flac',
  '.aac',
  '.ogg',
  '.m4a',
  '.wma',
  '.ac3',
  '.dts',
  '.eac3',
  '.ape',
  '.alac',
  '.opus'
]);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp4':
    case '.m4v':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.mp3':
      return 'audio/mpeg';
    case '.wav':
      return 'audio/wav';
    case '.ogg':
      return 'audio/ogg';
    case '.flac':
      return 'audio/flac';
    case '.aac':
      return 'audio/aac';
    case '.m4a':
      return 'audio/mp4';
    case '.opus':
      return 'audio/opus';
    default:
      return 'video/mp4';
  }
}

function parseDurationFromFfmpeg(output) {
  // Matches "Duration: 00:01:23.45"
  const match = output.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const hours = parseFloat(match[1]);
  const minutes = parseFloat(match[2]);
  const seconds = parseFloat(match[3]);
  return hours * 3600 + minutes * 60 + seconds;
}

function parseResolutionFromFfmpeg(output) {
  // Matches "Video: ... 1920x1080"
  const match = output.match(/,\s*(\d{3,4})x(\d{3,4})/);
  if (!match) return undefined;
  const width = parseInt(match[1], 10);
  const height = parseInt(match[2], 10);
  if (height >= 2160 || width >= 3840) return '4K';
  if (height >= 1080 || width >= 1920) return '1080p';
  if (height >= 720 || width >= 1280) return '720p';
  return '720p';
}

function probeMediaFile(filePath, binaryPath) {
  return new Promise(resolve => {
    if (!fs.existsSync(filePath)) {
      return resolve({ duration: 0, title: path.basename(filePath), type: 'video' });
    }

    const ext = path.extname(filePath).toLowerCase();
    const isAudio = AUDIO_EXTS.has(ext);

    const proc = spawn(binaryPath, ['-i', filePath], {
      windowsHide: true
    });

    let stderr = '';
    proc.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    proc.on('close', () => {
      const duration = parseDurationFromFfmpeg(stderr);
      const resolution = parseResolutionFromFfmpeg(stderr) || (isAudio ? 'Audio' : '1080p');
      const isVideoTrack = stderr.includes('Video:');

      resolve({
        duration: Math.round(duration),
        resolution,
        type: isVideoTrack ? 'video' : isAudio ? 'audio' : 'video',
        title: path.basename(filePath, path.extname(filePath))
      });
    });

    proc.on('error', () => {
      resolve({
        duration: 0,
        resolution: isAudio ? 'Audio' : '1080p',
        type: isAudio ? 'audio' : 'video',
        title: path.basename(filePath, path.extname(filePath))
      });
    });
  });
}

function createStreamServer(isPackaged, resourcesPath) {
  const binary = resolveFfmpegBinary(isPackaged, resourcesPath);

  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, 'http://127.0.0.1');

    if (reqUrl.pathname === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, binary }));
    }

    if (reqUrl.pathname === '/probe') {
      const targetFile = reqUrl.searchParams.get('file');
      if (!targetFile) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'file parameter is required' }));
      }
      probeMediaFile(targetFile, binary).then(meta => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(meta));
      });
      return;
    }

    if (reqUrl.pathname === '/stream') {
      const targetFile = reqUrl.searchParams.get('file');
      const startParam = parseFloat(reqUrl.searchParams.get('start') || '0');

      if (!targetFile || !fs.existsSync(targetFile)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('File not found');
      }

      const ext = path.extname(targetFile).toLowerCase();

      // CASE 1: Direct Playable Media (MP4, WebM, MP3, etc.) - Fast HTTP Range Streaming
      if (DIRECT_PLAY_EXTS.has(ext)) {
        const stat = fs.statSync(targetFile);
        const fileSize = stat.size;
        const range = req.headers.range;
        const contentType = getMimeType(targetFile);

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunkSize = end - start + 1;
          const fileStream = fs.createReadStream(targetFile, { start, end });

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
          });
          fileStream.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
          });
          fs.createReadStream(targetFile).pipe(res);
        }
        return;
      }

      // CASE 2: Universal Transcoding for Unsupported Containers/Codecs (AVI, MKV, WMV, FLV, VOB, TS, etc.)
      const isAudioOnly = AUDIO_EXTS.has(ext) && !targetFile.match(/\.(mkv|avi|mov|flv|wmv)$/i);

      let ffmpegArgs;
      let contentType = 'video/mp4';

      if (isAudioOnly) {
        contentType = 'audio/aac';
        ffmpegArgs = [
          ...(startParam > 0 ? ['-ss', String(startParam)] : []),
          '-i', targetFile,
          '-c:a', 'aac',
          '-b:a', '256k',
          '-f', 'adts',
          'pipe:1'
        ];
      } else {
        contentType = 'video/mp4';
        ffmpegArgs = [
          ...(startParam > 0 ? ['-ss', String(startParam)] : []),
          '-i', targetFile,
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-tune', 'zerolatency',
          '-crf', '22',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-ac', '2',
          '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
          '-f', 'mp4',
          'pipe:1'
        ];
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });

      const ffmpegProc = spawn(binary, ffmpegArgs, {
        windowsHide: true
      });

      ffmpegProc.stdout.pipe(res);

      ffmpegProc.stderr.on('data', () => {
        // Suppress or debug log
      });

      const killFfmpeg = () => {
        try {
          if (!ffmpegProc.killed) {
            ffmpegProc.kill('SIGKILL');
          }
        } catch (e) {}
      };

      req.on('close', killFfmpeg);
      res.on('close', killFfmpeg);
      ffmpegProc.on('error', killFfmpeg);
    }
  });

  return new Promise((resolve, reject) => {
    // Listen on port 0 to let OS assign an available high port automatically
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, binary });
    });
    server.on('error', reject);
  });
}

module.exports = {
  createStreamServer,
  probeMediaFile,
  resolveFfmpegBinary,
  AUDIO_EXTS,
  DIRECT_PLAY_EXTS
};
