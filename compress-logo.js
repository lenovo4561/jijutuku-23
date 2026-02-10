const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const inputPath = path.join(__dirname, 'src', 'assets', 'images', 'logo.png')
const outputPath = path.join(
  __dirname,
  'src',
  'assets',
  'images',
  'logo-compressed.png'
)
const backupPath = path.join(
  __dirname,
  'src',
  'assets',
  'images',
  'logo-original.png'
)

async function compressLogo() {
  try {
    // 备份原始文件
    if (fs.existsSync(inputPath)) {
      fs.copyFileSync(inputPath, backupPath)
      console.log('✓ 原始 logo 已备份为 logo-original.png')
    }

    // 压缩并调整大小为 192x192
    await sharp(inputPath)
      .resize(192, 192, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outputPath)

    console.log('✓ Logo 已压缩为 192x192')

    // 获取文件大小
    const originalStats = fs.statSync(inputPath)
    const compressedStats = fs.statSync(outputPath)

    console.log(`原始文件大小: ${(originalStats.size / 1024).toFixed(2)} KB`)
    console.log(`压缩后大小: ${(compressedStats.size / 1024).toFixed(2)} KB`)
    console.log(
      `压缩率: ${(
        (1 - compressedStats.size / originalStats.size) *
        100
      ).toFixed(2)}%`
    )

    // 替换原文件
    fs.copyFileSync(outputPath, inputPath)
    fs.unlinkSync(outputPath)
    console.log('✓ 已替换原 logo 文件')
  } catch (error) {
    console.error('压缩失败:', error.message)
    process.exit(1)
  }
}

compressLogo()
