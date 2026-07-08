const sharp = require('sharp');
const files = ['hero-dashboard-raster', 'screenshot-dashboard-raster', 'screenshot-kanban-raster', 'screenshot-calendar-raster'];
files.forEach(f => {
  sharp('public/demo/' + f + '.png').webp({ quality: 75 }).toFile('public/demo/' + f + '.webp');
});