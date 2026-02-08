// Polyomino puzzle piece generator
// Creates irregular puzzle pieces that tile a grid with row/col spanning

export function generatePolyominoPieces(todoCount) {
  // Determine grid size based on todo count
  const minPieces = Math.max(todoCount, 4);
  const cols = Math.ceil(Math.sqrt(minPieces));
  const rows = Math.ceil(minPieces / cols);
  
  // Ensure we have enough cells for all pieces
  const totalCells = rows * cols;
  
  // Generate pieces using a simple tiling algorithm
  const pieces = [];
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
  let pieceId = 0;
  
  // Simple greedy algorithm to place polyomino pieces
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== null) continue;
      
      // Determine piece shape based on available space
      const shape = chooseShape(grid, r, c, rows, cols, todoCount - pieces.length);
      
      const piece = {
        id: pieceId++,
        cells: [],
        rowSpan: 1,
        colSpan: 1,
        gridRow: r + 1,
        gridCol: c + 1
      };
      
      // Mark cells for this piece
      for (let dr = 0; dr < shape.rows; dr++) {
        for (let dc = 0; dc < shape.cols; dc++) {
          if (r + dr < rows && c + dc < cols && grid[r + dr][c + dc] === null) {
            grid[r + dr][c + dc] = piece.id;
            piece.cells.push({ row: r + dr, col: c + dc });
          }
        }
      }
      
      piece.rowSpan = shape.rows;
      piece.colSpan = shape.cols;
      pieces.push(piece);
      
      // Stop if we have enough pieces
      if (pieces.length >= todoCount) break;
    }
    if (pieces.length >= todoCount) break;
  }
  
  return { pieces, rows, cols };
}

function chooseShape(grid, row, col, maxRows, maxCols, remainingPieces) {
  const availableRows = countAvailableRows(grid, row, col, maxRows, maxCols);
  const availableCols = countAvailableCols(grid, row, col, maxRows, maxCols);
  
  // Randomly choose shape based on available space
  const shapes = [];
  
  // Single cell (monomino)
  shapes.push({ rows: 1, cols: 1, weight: 3 });
  
  // Horizontal domino (1x2)
  if (availableCols >= 2 && remainingPieces > 1) {
    shapes.push({ rows: 1, cols: 2, weight: 2 });
  }
  
  // Vertical domino (2x1)
  if (availableRows >= 2 && remainingPieces > 1) {
    shapes.push({ rows: 2, cols: 1, weight: 2 });
  }
  
  // L-tromino (2x2 minus one)
  if (availableRows >= 2 && availableCols >= 2 && remainingPieces > 2) {
    shapes.push({ rows: 2, cols: 2, weight: 1, lShape: true });
  }
  
  // Tetromino shapes for larger remaining counts
  if (availableCols >= 3 && remainingPieces > 3) {
    shapes.push({ rows: 1, cols: 3, weight: 1 }); // I-tetromino horizontal
  }
  
  if (availableRows >= 3 && remainingPieces > 3) {
    shapes.push({ rows: 3, cols: 1, weight: 1 }); // I-tetromino vertical
  }
  
  // Weighted random selection
  const totalWeight = shapes.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const shape of shapes) {
    random -= shape.weight;
    if (random <= 0) {
      // For L-shapes, randomly choose which corner to omit
      if (shape.lShape) {
        const omitCorner = Math.floor(Math.random() * 4); // 0: TL, 1: TR, 2: BL, 3: BR
        return { ...shape, omitCorner };
      }
      return shape;
    }
  }
  
  return shapes[0];
}

function countAvailableRows(grid, startRow, startCol, maxRows, maxCols) {
  let count = 0;
  for (let r = startRow; r < maxRows; r++) {
    if (grid[r][startCol] === null) count++;
    else break;
  }
  return count;
}

function countAvailableCols(grid, startRow, startCol, maxRows, maxCols) {
  let count = 0;
  for (let c = startCol; c < maxCols; c++) {
    if (grid[startRow][c] === null) count++;
    else break;
  }
  return count;
}

// Generate CSS grid layout for pieces
export function generatePieceStyles(pieces, revealedPieces, availableReveals) {
  return pieces.map(piece => {
    const isRevealed = revealedPieces.has(piece.id);
    const canReveal = !isRevealed && availableReveals > 0;
    
    return {
      gridRow: `${piece.gridRow} / span ${piece.rowSpan}`,
      gridColumn: `${piece.gridCol} / span ${piece.colSpan}`,
      isRevealed,
      canReveal,
      piece
    };
  });
}
