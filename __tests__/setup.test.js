/**
 * Tests for the enhanced setup script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Setup Script', () => {
  const setupScriptPath = path.join(__dirname, '..', 'script', 'setup');

  beforeAll(() => {
    // Ensure the setup script exists and is executable
    expect(fs.existsSync(setupScriptPath)).toBe(true);
  });

  test('setup script should be executable', () => {
    const stats = fs.statSync(setupScriptPath);
    // Check if the file has executable permission
    // eslint-disable-next-line no-bitwise
    expect(stats.mode & 0o111).not.toBe(0);
  });

  test('setup script should contain progress functions', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for new progress functions
    expect(content).toContain('progress_header()');
    expect(content).toContain('step_start()');
    expect(content).toContain('step_success()');
    expect(content).toContain('step_warning()');
    expect(content).toContain('step_error()');
    expect(content).toContain('step_info()');
    expect(content).toContain('show_progress()');
    expect(content).toContain('final_summary()');
  });

  test('setup script should contain color definitions', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for color definitions
    expect(content).toContain('RED=');
    expect(content).toContain('GREEN=');
    expect(content).toContain('YELLOW=');
    expect(content).toContain('BLUE=');
    expect(content).toContain('CYAN=');
    expect(content).toContain('NC=');
  });

  test('setup script should contain progress tracking variables', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for progress tracking
    expect(content).toContain('TOTAL_STEPS=8');
    expect(content).toContain('CURRENT_STEP=0');
    expect(content).toContain('START_TIME=');
  });

  test('setup script should have proper step structure', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for all steps
    expect(content).toContain('Step 1: Xcode Tools');
    expect(content).toContain('Step 2: Homebrew');
    expect(content).toContain('Step 3: Ruby Environment');
    expect(content).toContain('Step 4: Node.js Environment');
    expect(content).toContain('Step 5: Yarn Package Manager');
    expect(content).toContain('Step 6: Project Dependencies');
    expect(content).toContain('Step 7: iOS Dependencies');
    expect(content).toContain('Step 8: Final Setup');
  });

  test('setup script should have enhanced user feedback', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for enhanced feedback
    expect(content).toContain('✅'); // Success checkmarks
    expect(content).toContain('⚠️'); // Warnings
    expect(content).toContain('❌'); // Errors
    expect(content).toContain('ℹ️'); // Info
    expect(content).toContain('🎉'); // Celebration
    expect(content).toContain('⏱️'); // Timer
  });

  test('setup script should contain progress bar functionality', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for progress bar elements
    expect(content).toContain('Progress: [');
    expect(content).toContain('█'); // Filled progress
    expect(content).toContain('░'); // Empty progress
    expect(content).toContain('percentage');
  });

  test('setup script should have timing functionality', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check for timing
    expect(content).toContain('START_TIME=$(date +%s)');
    expect(content).toContain('end_time=$(date +%s)');
    expect(content).toContain('duration=');
    expect(content).toContain('Total setup time:');
  });

  test('setup script should maintain all original functionality', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');

    // Check that all original functionality is preserved
    expect(content).toContain('xcode-select');
    expect(content).toContain('brew');
    expect(content).toContain('rbenv');
    expect(content).toContain('nvm');
    expect(content).toContain('yarn');
    expect(content).toContain('pod install');
  });

  test('setup script should start with proper shebang', () => {
    const content = fs.readFileSync(setupScriptPath, 'utf8');
    expect(content.startsWith('#!/bin/sh')).toBe(true);
  });

  test('setup script dry run should not fail on syntax', () => {
    // Test that the script doesn't have syntax errors
    // Note: This uses bash -n to check syntax without executing
    expect(() => {
      execSync(`bash -n "${setupScriptPath}"`, { stdio: 'pipe' });
    }).not.toThrow();
  });
});
