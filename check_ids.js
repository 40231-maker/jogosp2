const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');

const issues = [];

// Check for common bugs
if (code.includes('innerText')) {
  // OK - using innerText
}

// Check that openUpgradesModal resets _waveTransitioning
if (!code.includes('_waveTransitioning = false') || 
    !code.includes("state = 'PLAYING'")) {
  issues.push('openUpgradesModal might not reset _waveTransitioning');
}

// Check openUpgradesModal sets state after upgrade pick
const upgradeClickSection = code.match(/card\.addEventListener\('click'[\s\S]*?container\.appendChild/);
if (upgradeClickSection && !upgradeClickSection[0].includes('_waveTransitioning')) {
  issues.push('WARN: openUpgradesModal click handler may need _waveTransitioning = false');
}

// Check boss HUD is properly hidden in startEndlessWave
if (!code.includes("'boss-hud-bar'")) {
  issues.push('boss-hud-bar not referenced');
}

// Check for startEndlessWave resetting waveTransitioning
const endlessWave = code.match(/startEndlessWave[\s\S]*?updateHUDEnemies/);
if (endlessWave && !endlessWave[0].includes('_waveTransitioning')) {
  issues.push('WARN: startEndlessWave does not reset _waveTransitioning');
}

// Check that startCampaignWave is same
const campaignWave = code.match(/startCampaignWave[\s\S]*?updateHUDEnemies/);
if (campaignWave && !campaignWave[0].includes('_waveTransitioning')) {
  issues.push('WARN: startCampaignWave does not reset _waveTransitioning');
}

console.log('Issues found:');
if (issues.length === 0) {
  console.log('  None detected');
} else {
  issues.forEach(i => console.log('  - ' + i));
}

// Check openUpgradesModal for _waveTransitioning reset
const upgradeModal = code.match(/openUpgradesModal\(\)[\s\S]*?modal\.classList\.remove/);
if (upgradeModal) {
  const hasReset = upgradeModal[0].includes('_waveTransitioning = false') || 
                   code.indexOf('openUpgradesModal') > -1;
  console.log('\nopenUpgradesModal found:', !!upgradeModal);
}

// Count total lines
const lines = code.split('\n').length;
console.log('\nScript.js lines:', lines);
