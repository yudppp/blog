const { createCanvas, registerFont, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * OGP画像を生成する関数
 * @param {string} title - 投稿のタイトル
 * @param {string} date - 投稿の日付 (例: "2024/12/22")
 * @param {string} outputPath - 生成した画像の保存パス
 */
async function generateOGPImage(title, date, outputPath) {
    try {
        // 画像のサイズを設定
        const width = 1200;
        const height = 630;

        // キャンバスを作成
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // 背景色を設定
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // ロゴ画像を左上に描画
        const logoPath = path.join(__dirname, 'static/logo.png');
        const logoImage = await loadImage(logoPath);
        const logoWidth = 240; // ロゴの幅
        const logoHeight = 80; // ロゴの高さ
        ctx.drawImage(logoImage, 30, 30, logoWidth, logoHeight);

        // フォントの登録
        registerFont(path.join(__dirname, 'fonts', 'NotoSansJP-Light.ttf'), { family: 'Noto Sans JP' });

        // タイトルのスタイルを設定
        ctx.fillStyle = '#000000'; // テキスト色
        ctx.font = 'bold 60px "Noto Sans JP"'; // フォントサイズとスタイル
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // テキストの折り返し処理（最大3行）
        const maxWidth = width - 100; // 左右に50pxの余白
        const maxLines = 3;
        const lines = wrapText(ctx, title, maxWidth, maxLines);
        const lineHeight = 70;
        const textHeight = lines.length * lineHeight;

        // タイトルをキャンバスの中央に描画
        lines.forEach((line, index) => {
            ctx.fillText(line, width / 2, height / 2 - textHeight / 2 + index * lineHeight + 15);
        });

        // 日付のスタイルを設定
        ctx.fillStyle = '#555555'; // テキスト色
        ctx.font = '30px "Noto Sans JP"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        // 日付を画像の下部に描画
        ctx.fillText(date, width / 2, height - 50);

        // 出力先ディレクトリが存在するか確認し、存在しない場合は作成
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // 画像をファイルに保存
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    } catch (error) {
        console.error('OGP画像の生成中にエラーが発生しました:', error);
    }
}

/**
 * テキストを指定された幅で折り返し、最大行数を制限する関数
 * 日本語の場合、文字単位での折り返しを行い、必要に応じて省略記号を追加します。
 * @param {CanvasRenderingContext2D} ctx - Canvasのコンテキスト
 * @param {string} text - 折り返したいテキスト
 * @param {number} maxWidth - テキストの最大幅
 * @param {number} maxLines - 最大行数
 * @returns {string[]} - 折り返されたテキストの配列
 */
function wrapText(ctx, text, maxWidth, maxLines) {
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const testLine = currentLine + char;
        const { width } = ctx.measureText(testLine);

        if (width > maxWidth) {
            if (currentLine.length === 0) {
                // 一文字でも収まらない場合はそのまま追加
                lines.push(char);
                currentLine = '';
            } else {
                lines.push(currentLine);
                currentLine = char;
            }

            if (lines.length === maxLines) {
                // 最大行数に達した場合、省略記号を追加
                lines[maxLines - 1] = truncateText(ctx, lines[maxLines - 1], maxWidth);
                return lines;
            }
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    // 最大行数を超えた場合、省略記号を追加
    if (lines.length > maxLines) {
        lines.length = maxLines;
        lines[maxLines - 1] = truncateText(ctx, lines[maxLines - 1], maxWidth);
    }

    return lines;
}

/**
 * テキストを省略記号付きでトリミングする関数
 * @param {CanvasRenderingContext2D} ctx - Canvasのコンテキスト
 * @param {string} text - トリミングしたいテキスト
 * @param {number} maxWidth - テキストの最大幅
 * @returns {string} - トリミングされたテキスト
 */
function truncateText(ctx, text, maxWidth) {
    const ellipsis = '...';
    let truncatedText = text;

    while (ctx.measureText(truncatedText + ellipsis).width > maxWidth && truncatedText.length > 0) {
        truncatedText = truncatedText.slice(0, -1);
    }

    return truncatedText + ellipsis;
}

module.exports = generateOGPImage;
