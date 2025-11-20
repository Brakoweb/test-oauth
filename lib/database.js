import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'tokens.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read the database
function readDB() {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    return {};
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write to the database
function writeDB(data) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Save tokens for a location
export function saveTokens(locationId, tokenData) {
  const db = readDB();
  db[locationId] = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
    scope: tokenData.scope,
    companyId: tokenData.companyId,
    savedAt: new Date().toISOString()
  };
  writeDB(db);
  console.log(`[DB] Tokens saved for location: ${locationId}`);
}

// Get tokens for a location
export function getTokens(locationId) {
  const db = readDB();
  const tokens = db[locationId];
  if (!tokens) {
    console.log(`[DB] No tokens found for location: ${locationId}`);
    return null;
  }
  console.log(`[DB] Tokens retrieved for location: ${locationId}`);
  return tokens;
}

// Check if location has tokens
export function hasTokens(locationId) {
  const db = readDB();
  return !!db[locationId];
}
