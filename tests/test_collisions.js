const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const source = fs.readFileSync('script.js', 'utf8');
const start = source.indexOf('function resolveArenaCollision(');
const end = source.indexOf('\n/* ===', start);
assert(start >= 0 && end > start, 'Função de colisão encontrada');
vm.runInThisContext(source.slice(start, end));

function resolveAt(x, z, collider, radius = 20) {
  const entity = { x, z, radius };
  resolveArenaCollision(entity, { mapColliders: [collider], enemies: [] }, false);
  return entity;
}

// Centro do obstáculo não pode deixar o jogador preso dentro do colisor.
{
  const c = { x: 0, z: 0, w: 150, d: 32, r: 0.25 };
  const p = resolveAt(0, 0, c);
  const dx = p.x - c.x, dz = p.z - c.z;
  const lx = dx * Math.cos(c.r) - dz * Math.sin(c.r);
  const lz = dx * Math.sin(c.r) + dz * Math.cos(c.r);
  assert(Math.abs(lx) >= c.w / 2 + 19.9 || Math.abs(lz) >= c.d / 2 + 19.9,
    'Jogador é empurrado para fora de um obstáculo rotacionado');
}

// Um ponto distante não deve ser alterado pelo colisor.
{
  const p = resolveAt(300, 300, { x: 0, z: 0, w: 150, d: 32, r: 0.25 });
  assert.strictEqual(p.x, 300);
  assert.strictEqual(p.z, 300);
}

// Testes estáticos da recarga: pente vazio chama reload e reserva é transferida no fim.
assert(/if \(w\.mag <= 0\)\s*\{\s*this\.reload\(game\);/m.test(source), 'Pente vazio tenta recarregar');
assert(/w\.mag === undefined \|\| w\.mag === null/.test(source), 'Recarga distingue pente vazio de propriedade ausente');
assert(/const toLoad = Math\.min\(needed, w\.ammo\);[\s\S]*?w\.mag \+= toLoad;[\s\S]*?w\.ammo -= toLoad;/.test(source), 'Munição reserva é transferida para o pente');

console.log('PASSOU: colisão orientada, ausência de colisão distante e verificações estáticas da recarga.');
