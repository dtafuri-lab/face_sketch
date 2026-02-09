// p5.js Face Sketch - Selfie style matching photo with peace sign
// Window responsive - Desktop size

let faceSize;
let points = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    noLoop();
    generatePoints();
}

function calculateSizes() {
    faceSize = min(width, height) * 0.85;
}

function generatePoints() {
    calculateSizes();
    points = [];
    
    // Position face on the RIGHT side
    let centerX = width * 0.7;
    let centerY = height * 0.65;
    let s = faceSize / 300;
    
    let spacing = 16;
    
    for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
            let emoji = getEmojiAtPoint(x, y, centerX, centerY, s);
            points.push({ x: x, y: y, emoji: emoji, size: 13 });
        }
    }
}

function getEmojiAtPoint(x, y, centerX, centerY, s) {
    // Face = yellow 🔶
    // Hair, glasses, eyebrows, mustache, mouth, nose = blue 🔵
    // Peace sign hand = yellow triangles 🔶
    // Background = red 🟥
    
    // Face - slimmer oval shape
    let faceWidth = faceSize * 0.36;
    let faceHeight = faceSize * 0.55;
    let faceDist = pow((x - centerX) / faceWidth, 2) + pow((y - centerY) / faceHeight, 2);
    
    // Eye positions - adjusted for slimmer face
    let eyeY = centerY - 25 * s;
    let eyeSpacing = 45 * s;
    let leftEyeX = centerX - eyeSpacing;
    let rightEyeX = centerX + eyeSpacing;
    
    // ===== PEACE SIGN HAND (yellow triangles) - on the LEFT side =====
    let handX = width * 0.28;
    let handY = height * 0.68;
    
    // Fingers - smaller and shorter
    let fingerLength = 100 * s;
    let fingerWidth = 18 * s;
    
    // INDEX FINGER - goes up and to the LEFT (spreading out)
    let indexStartX = handX - 12 * s;
    let indexStartY = handY;
    let indexEndX = handX - 55 * s;
    let indexEndY = handY - fingerLength;
    
    let indexDx = indexEndX - indexStartX;
    let indexDy = indexEndY - indexStartY;
    let indexLen = sqrt(indexDx * indexDx + indexDy * indexDy);
    
    let indexT = ((x - indexStartX) * indexDx + (y - indexStartY) * indexDy) / (indexLen * indexLen);
    if (indexT >= 0 && indexT <= 1) {
        let closestX = indexStartX + indexT * indexDx;
        let closestY = indexStartY + indexT * indexDy;
        let distToIndex = dist(x, y, closestX, closestY);
        if (distToIndex < fingerWidth) {
            return '\u{1F536}';
        }
    }
    
    // MIDDLE FINGER - goes up and to the RIGHT (spreading out)
    let middleStartX = handX + 12 * s;
    let middleStartY = handY;
    let middleEndX = handX + 55 * s;
    let middleEndY = handY - fingerLength;
    
    let middleDx = middleEndX - middleStartX;
    let middleDy = middleEndY - middleStartY;
    let middleLen = sqrt(middleDx * middleDx + middleDy * middleDy);
    
    let middleT = ((x - middleStartX) * middleDx + (y - middleStartY) * middleDy) / (middleLen * middleLen);
    if (middleT >= 0 && middleT <= 1) {
        let closestX = middleStartX + middleT * middleDx;
        let closestY = middleStartY + middleT * middleDy;
        let distToMiddle = dist(x, y, closestX, closestY);
        if (distToMiddle < fingerWidth) {
            return '\u{1F536}';
        }
    }
    
    // PALM (base of hand below fingers)
    let palmY = handY + 25 * s;
    let palmWidth = 45 * s;
    let palmHeight = 40 * s;
    let palmDist = pow((x - handX) / palmWidth, 2) + pow((y - palmY) / palmHeight, 2);
    if (palmDist < 1) {
        return '\u{1F536}';
    }
    
    // ARM - coming from BOTTOM of screen, going UP to the hand
    let armStartX = handX;
    let armStartY = handY + 50 * s;
    let armEndX = handX + 100 * s;  // slightly to the right at bottom
    let armEndY = height + 50;       // off screen at bottom
    let armWidth = 45 * s;
    
    let armDx = armEndX - armStartX;
    let armDy = armEndY - armStartY;
    let armLen = sqrt(armDx * armDx + armDy * armDy);
    
    let armT = ((x - armStartX) * armDx + (y - armStartY) * armDy) / (armLen * armLen);
    if (armT >= 0 && armT <= 1) {
        let closestX = armStartX + armT * armDx;
        let closestY = armStartY + armT * armDy;
        let distToArm = dist(x, y, closestX, closestY);
        if (distToArm < armWidth) {
            return '\u{1F536}';
        }
    }
    
    // ===== HAIR (blue) - shorter on top and sides =====
    let hairTopY = centerY - faceHeight * 0.85;
    
    // Main hair mass on top - shorter
    for (let i = -3; i <= 3; i++) {
        let hx = centerX + i * 22 * s;
        let hy = hairTopY + abs(i) * 6 * s;
        let hDist = dist(x, y, hx, hy);
        if (hDist < 30 * s) {
            return '\u{1F535}';
        }
    }
    
    // Second row of hair - shorter
    for (let i = -2; i <= 2; i++) {
        let hx = centerX + i * 28 * s;
        let hy = hairTopY - 15 * s;
        let hDist = dist(x, y, hx, hy);
        if (hDist < 25 * s) {
            return '\u{1F535}';
        }
    }
    
    // Hair sides - shorter
    let leftHairX = centerX - faceWidth * 0.85;
    let rightHairX = centerX + faceWidth * 0.85;
    let sideHairTopY = centerY - faceHeight * 0.5;
    let sideHairBottomY = centerY - faceHeight * 0.2;
    
    if (x > leftHairX - 15 * s && x < leftHairX + 8 * s &&
        y > sideHairTopY && y < sideHairBottomY) {
        return '\u{1F535}';
    }
    
    if (x > rightHairX - 8 * s && x < rightHairX + 15 * s &&
        y > sideHairTopY && y < sideHairBottomY) {
        return '\u{1F535}';
    }
    
    // Fill in top of head with hair - shorter
    if (y < centerY - faceHeight * 0.5 && y > centerY - faceHeight * 0.95 &&
        x > centerX - faceWidth * 1.0 && x < centerX + faceWidth * 1.0) {
        return '\u{1F535}';
    }
    
    // ===== EYEBROWS (blue) =====
    let browY = eyeY - 55 * s;
    let browWidth = 40 * s;
    let browHeight = 10 * s;
    
    let leftBrowDist = pow((x - leftEyeX) / browWidth, 2) + pow((y - browY) / browHeight, 2);
    if (leftBrowDist < 1) {
        return '\u{1F535}';
    }
    
    let rightBrowDist = pow((x - rightEyeX) / browWidth, 2) + pow((y - browY) / browHeight, 2);
    if (rightBrowDist < 1) {
        return '\u{1F535}';
    }
    
    // ===== GLASSES (blue) - SQUARED frames =====
    let glassSize = 42 * s;
    let frameThickness = 12 * s;
    
    // Left glass - square frame
    let leftGlassLeft = leftEyeX - glassSize;
    let leftGlassRight = leftEyeX + glassSize;
    let leftGlassTop = eyeY - glassSize;
    let leftGlassBottom = eyeY + glassSize;
    
    let inLeftGlassArea = (x > leftGlassLeft && x < leftGlassRight && 
                          y > leftGlassTop && y < leftGlassBottom);
    let inLeftGlassInner = (x > leftGlassLeft + frameThickness && x < leftGlassRight - frameThickness && 
                           y > leftGlassTop + frameThickness && y < leftGlassBottom - frameThickness);
    if (inLeftGlassArea && !inLeftGlassInner) {
        return '\u{1F535}';
    }
    
    // Right glass - square frame
    let rightGlassLeft = rightEyeX - glassSize;
    let rightGlassRight = rightEyeX + glassSize;
    let rightGlassTop = eyeY - glassSize;
    let rightGlassBottom = eyeY + glassSize;
    
    let inRightGlassArea = (x > rightGlassLeft && x < rightGlassRight && 
                           y > rightGlassTop && y < rightGlassBottom);
    let inRightGlassInner = (x > rightGlassLeft + frameThickness && x < rightGlassRight - frameThickness && 
                            y > rightGlassTop + frameThickness && y < rightGlassBottom - frameThickness);
    if (inRightGlassArea && !inRightGlassInner) {
        return '\u{1F535}';
    }
    
    // Glasses bridge
    if (y > eyeY - 8 * s && y < eyeY + 8 * s && 
        x > leftGlassRight - 5 * s && x < rightGlassLeft + 5 * s) {
        return '\u{1F535}';
    }
    
    // ===== EYES (blue) =====
    let leftEyeDist = dist(x, y, leftEyeX, eyeY);
    let rightEyeDist = dist(x, y, rightEyeX, eyeY);
    if (leftEyeDist < 18 * s) {
        return '\u{1F535}';
    }
    if (rightEyeDist < 18 * s) {
        return '\u{1F535}';
    }
    
    // ===== NOSE (blue) - bigger =====
    let noseTopY = eyeY + 18 * s;
    let noseBottomY = centerY + 30 * s;
    let noseWidth = 12 * s;
    
    // Nose bridge (vertical line) - wider
    if (x > centerX - noseWidth && x < centerX + noseWidth &&
        y > noseTopY && y < noseBottomY) {
        return '\u{1F535}';
    }
    
    // Nose tip (bigger circle at bottom)
    let noseTipY = noseBottomY + 8 * s;
    if (dist(x, y, centerX, noseTipY) < 18 * s) {
        return '\u{1F535}';
    }
    
    // ===== MUSTACHE (blue) - lowered and curving down =====
    let mustacheY = centerY + 75 * s;
    let mustacheWidth = 45 * s;
    let mustacheHeight = 10 * s;
    
    // Main mustache body with downward curve at ends
    let relX = x - centerX;
    let curveOffset = pow(abs(relX) / (40 * s), 2) * 12 * s;
    let adjustedMustacheY = mustacheY + curveOffset;
    
    let mustacheDist = pow((x - centerX) / mustacheWidth, 2) + pow((y - adjustedMustacheY) / mustacheHeight, 2);
    if (mustacheDist < 1 && abs(relX) < mustacheWidth) {
        return '\u{1F535}';
    }
    
    // ===== MOUTH (blue) - thinner =====
    let mouthY = centerY + 105 * s;
    let mouthWidth = 28 * s;
    let mouthHeight = 8 * s;
    let mouthDist = pow((x - centerX) / mouthWidth, 2) + pow((y - mouthY) / mouthHeight, 2);
    if (mouthDist < 1) {
        return '\u{1F535}';
    }
    
    // ===== EARS (yellow) - closer to face =====
    let earY = eyeY + 20 * s;
    let leftEarX = centerX - faceWidth + 5 * s;
    let rightEarX = centerX + faceWidth - 5 * s;
    
    if (dist(x, y, leftEarX, earY) < 18 * s) {
        return '\u{1F536}';
    }
    if (dist(x, y, rightEarX, earY) < 18 * s) {
        return '\u{1F536}';
    }
    
    // ===== FACE (yellow) =====
    if (faceDist < 1) {
        return '\u{1F536}';
    }
    
    // ===== NECK (yellow) - more visible on right side =====
    let neckTop = centerY + faceHeight * 0.85;
    let neckLeftWidth = faceWidth * 0.4;
    let neckRightWidth = faceWidth * 0.7;
    if (y > neckTop && y < neckTop + 80 * s &&
        x > centerX - neckLeftWidth && x < centerX + neckRightWidth) {
        return '\u{1F536}';
    }
    
    // ===== BACKGROUND (red) =====
    return '\u{1F7E5}';
}

function draw() {
    background(0);
    
    noStroke();
    for (let p of points) {
        textSize(p.size);
        text(p.emoji, p.x, p.y);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    generatePoints();
    redraw();
}
