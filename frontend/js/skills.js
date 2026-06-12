/**
 * 개선된 스킬 시스템
 * 캐릭터별 특수 메커니즘 지원
 */

class Skill {
    constructor(skillData, character) {
        this.id = skillData.id;
        this.name = skillData.name;
        this.key = skillData.key;
        this.damage = skillData.damage || 0;
        this.range = skillData.range || 0;
        this.maxCooldown = skillData.cooldown || 0;
        this.cooldown = 0;
        this.manaCost = skillData.manaCost || 0;
        this.duration = skillData.duration || 0;
        this.effect = skillData.effect || null;
        this.character = character;
        this.isMagic = skillData.isMagic || false;
    }

    isReady() {
        return this.cooldown <= 0;
    }

    use() {
        this.cooldown = this.maxCooldown;
    }

    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }

    getProgress() {
        return 1 - (this.cooldown / this.maxCooldown);
    }
}

/**
 * 스킬 효과 관리 - 캐릭터별 특수 메커니즘
 */
class SkillEffect {
    static apply(skillData, caster, target, game) {
        const effect = skillData.effect;

        switch (effect) {
            // === 폰 특수 효과 ===
            case 'promotion':
                return SkillEffect.promotion(caster);
            case 'dashAttack':
                return SkillEffect.dashAttack(caster, skillData, game);
            case 'shield':
                return SkillEffect.shield(caster, skillData);
            case 'ultimateStrike':
                return SkillEffect.ultimateStrike(caster, skillData, game);

            // === 나이트 특수 효과 ===
            case 'distanceDamage':
                return SkillEffect.distanceDamage(caster);
            case 'chargeThrust':
                return SkillEffect.chargeThrust(caster, skillData, game);
            case 'evasion':
                return SkillEffect.evasion(caster, skillData);
            case 'ultCharge':
                return SkillEffect.ultCharge(caster, skillData, game);

            // === 비숍 마법 효과 ===
            case 'magicMastery':
                return SkillEffect.magicMastery(caster);
            case 'magicBurst':
                return SkillEffect.magicBurst(caster, skillData, game);
            case 'manaShield':
                return SkillEffect.manaShield(caster, skillData);
            case 'meteorStorm':
                return SkillEffect.meteorStorm(caster, skillData, game);

            // === 룩 절대 방어 효과 ===
            case 'absoluteDefense':
                return SkillEffect.absoluteDefense(caster);
            case 'defensiveStance':
                return SkillEffect.defensiveStance(caster, skillData);
            case 'reflectWall':
                return SkillEffect.reflectWall(caster, skillData);
            case 'absoluteBarrier':
                return SkillEffect.absoluteBarrier(caster, skillData, game);

            // === 퀸 고속 공격 효과 ===
            case 'comboAttack':
                return SkillEffect.comboAttack(caster);
            case 'bladeStorm':
                return SkillEffect.bladeStorm(caster, skillData, game);
            case 'haste':
                return SkillEffect.haste(caster, skillData);
            case 'thousandBlades':
                return SkillEffect.thousandBlades(caster, skillData, game);

            // === 킹 근접전 효과 ===
            case 'meleemaster':
                return SkillEffect.meleemaster(caster);
            case 'melee':
                return SkillEffect.melee(caster, skillData, game);
            case 'royalSwing':
                return SkillEffect.royalSwing(caster, skillData, game);
            case 'kingAura':
                return SkillEffect.kingAura(caster, skillData, game);
            case 'royalJudgment':
                return SkillEffect.royalJudgment(caster, skillData, game);

            default:
                return null;
        }
    }

    // ============ 폰 효과 ============
    static promotion(caster) {
        // 적 기지에 도달하면 강력한 기물로 변신 (구현은 나중)
        caster.promoted = true;
        caster.attackDamage *= 1.5;
        return { type: 'promotion' };
    }

    static dashAttack(caster, skillData, game) {
        const distance = 200;
        const angle = caster.angle;
        caster.x += Math.cos(angle) * distance;
        caster.y += Math.sin(angle) * distance;

        const enemies = game.findEnemiesInRange(caster, 100);
        enemies.forEach(enemy => {
            const damage = skillData.damage + Math.random() * 10;
            game.damageEnemy(enemy, damage, caster);
        });

        return { type: 'dashAttack', targetsHit: enemies.length };
    }

    static shield(caster, skillData) {
        caster.shielding = true;
        caster.defenseMultiplier = 1 - skillData.damageReduction;
        caster.shieldDuration = skillData.duration;
        return { type: 'shield', duration: skillData.duration };
    }

    static ultimateStrike(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        enemies.forEach(enemy => {
            game.damageEnemy(enemy, skillData.damage, caster);
            enemy.stunned = true;
            enemy.stunDuration = skillData.stun;
        });
        return { type: 'ultimateStrike', targetsHit: enemies.length };
    }

    // ============ 나이트 효과 ============
    static distanceDamage(caster) {
        caster.chargeDistance = 0;
        return { type: 'distanceDamage' };
    }

    static chargeThrust(caster, skillData, game) {
        const distance = 250;
        const angle = caster.angle;
        const startX = caster.x;
        const startY = caster.y;

        caster.x += Math.cos(angle) * distance;
        caster.y += Math.sin(angle) * distance;

        // 돌진 거리에 비례한 데미지 계산
        const chargedDistance = Math.hypot(caster.x - startX, caster.y - startY);
        const damageMultiplier = Math.min(3.0, 1 + (chargedDistance / distance) * 2);
        const finalDamage = skillData.damage * damageMultiplier;

        const enemies = game.findEnemiesInRange(caster, 120);
        enemies.forEach(enemy => {
            game.damageEnemy(enemy, finalDamage, caster);
            const knockAngle = Math.atan2(enemy.y - caster.y, enemy.x - caster.x);
            enemy.x += Math.cos(knockAngle) * skillData.knockback;
            enemy.y += Math.sin(knockAngle) * skillData.knockback;
        });

        return { type: 'chargeThrust', distance: chargedDistance, damageMultiplier, targetsHit: enemies.length };
    }

    static evasion(caster, skillData) {
        caster.evading = true;
        caster.dodgeChance = skillData.dodgeChance;
        caster.evasionDuration = skillData.duration;
        return { type: 'evasion', duration: skillData.duration };
    }

    static ultCharge(caster, skillData, game) {
        const distance = 300;
        const angle = caster.angle;
        const startX = caster.x;
        const startY = caster.y;

        caster.x += Math.cos(angle) * distance;
        caster.y += Math.sin(angle) * distance;

        const chargedDistance = Math.hypot(caster.x - startX, caster.y - startY);
        const damageMultiplier = Math.min(5.0, 1 + (chargedDistance / distance) * 4);
        const finalDamage = skillData.damage * damageMultiplier;

        const enemies = game.findEnemiesInRange(caster, 150);
        enemies.forEach(enemy => {
            game.damageEnemy(enemy, finalDamage, caster);
            const knockAngle = Math.atan2(enemy.y - caster.y, enemy.x - caster.x);
            enemy.x += Math.cos(knockAngle) * skillData.knockback;
            enemy.y += Math.sin(knockAngle) * skillData.knockback;
        });

        return { type: 'ultCharge', distance: chargedDistance, damageMultiplier, targetsHit: enemies.length };
    }

    // ============ 비숍 마법 효과 ============
    static magicMastery(caster) {
        caster.magicDamageBonus = 1.25;
        caster.manaRegenPerSecond = 3;
        return { type: 'magicMastery' };
    }

    static magicBurst(caster, skillData, game) {
        const enemies = game.findEnemiesInArea(
            caster.x + Math.cos(caster.angle) * skillData.range * 0.8,
            caster.y + Math.sin(caster.angle) * skillData.range * 0.8,
            skillData.aoeRadius
        );

        const magicDamage = skillData.damage * (caster.magicDamageBonus || 1);
        enemies.forEach(enemy => {
            game.damageEnemy(enemy, magicDamage, caster);
        });

        return { type: 'magicBurst', targetsHit: enemies.length };
    }

    static manaShield(caster, skillData) {
        const shieldAmount = Math.min(skillData.shieldAmount, caster.mana);
        caster.mana -= shieldAmount;
        caster.shield = (caster.shield || 0) + shieldAmount;
        caster.shieldDuration = skillData.duration;
        return { type: 'manaShield', shieldAmount };
    }

    static meteorStorm(caster, skillData, game) {
        const strikes = skillData.strikes || 8;
        const affectedEnemies = new Set();

        for (let i = 0; i < strikes; i++) {
            const angle = (Math.PI * 2 * i) / strikes;
            const distance = skillData.range * 0.7;
            const x = caster.x + Math.cos(angle) * distance;
            const y = caster.y + Math.sin(angle) * distance;

            const enemies = game.findEnemiesInArea(x, y, skillData.aoeRadius);
            const magicDamage = skillData.damage * (caster.magicDamageBonus || 1);

            enemies.forEach(enemy => {
                affectedEnemies.add(enemy);
                game.damageEnemy(enemy, magicDamage, caster);
            });
        }

        return { type: 'meteorStorm', targetsHit: affectedEnemies.size };
    }

    // ============ 룩 절대 방어 효과 ============
    static absoluteDefense(caster) {
        caster.baseDefense = 0.5; // 모든 피해 -50%
        caster.reflectPercent = 0.5; // 50% 반사
        return { type: 'absoluteDefense' };
    }

    static defensiveStance(caster, skillData) {
        caster.defending = true;
        caster.defenseMultiplier = 1 - skillData.damageReduction;
        caster.defendDuration = skillData.duration;
        return { type: 'defensiveStance', duration: skillData.duration };
    }

    static reflectWall(caster, skillData) {
        caster.reflecting = true;
        caster.reflectPercent = skillData.reflectPercent;
        caster.reflectDuration = skillData.duration;
        return { type: 'reflectWall', duration: skillData.duration };
    }

    static absoluteBarrier(caster, skillData, game) {
        caster.barrierActive = true;
        caster.defenseMultiplier = 1 - skillData.damageReduction;
        caster.barrierDuration = skillData.duration;

        if (skillData.teamProtection) {
            const allies = game.findAlliesInRange(caster, 200);
            allies.forEach(ally => {
                ally.barrierBonus = 0.5; // 팀원도 방어력 +50%
            });
        }

        return { type: 'absoluteBarrier', duration: skillData.duration, teamProtected: skillData.teamProtection };
    }

    // ============ 퀸 고속 공격 효과 ============
    static comboAttack(caster) {
        caster.comboCount = 0;
        caster.comboMultiplier = 1.0;
        return { type: 'comboAttack' };
    }

    static bladeStorm(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        const hits = skillData.hits || 6;

        enemies.forEach(enemy => {
            for (let i = 0; i < hits; i++) {
                setTimeout(() => {
                    const damage = skillData.damage * (1 + caster.comboMultiplier * 0.1);
                    game.damageEnemy(enemy, damage, caster);
                }, i * 50);
            }
        });

        return { type: 'bladeStorm', targetsHit: enemies.length, totalHits: enemies.length * hits };
    }

    static haste(caster, skillData) {
        caster.hasteActive = true;
        caster.attackSpeedMultiplier = skillData.attackSpeedMultiplier;
        caster.speedMultiplier = skillData.speedMultiplier;
        caster.hasteDuration = skillData.duration;
        return { type: 'haste', duration: skillData.duration };
    }

    static thousandBlades(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        const hits = skillData.hits || 20;

        enemies.forEach(enemy => {
            for (let i = 0; i < hits; i++) {
                setTimeout(() => {
                    const damage = skillData.damage * (1 + caster.comboMultiplier * 0.15);
                    game.damageEnemy(enemy, damage, caster);
                }, i * 30);
            }
        });

        return { type: 'thousandBlades', targetsHit: enemies.length, totalHits: enemies.length * hits };
    }

    // ============ 킹 근접전 효과 ============
    static meleemaster(caster) {
        caster.meleeMastery = true;
        caster.meleeDamageBonus = 1.5; // 근접 범위 내 +50% 피해
        return { type: 'meleemaster' };
    }

    static melee(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        enemies.forEach(enemy => {
            const baseDamage = caster.meleeMastery ? skillData.damage * caster.meleeDamageBonus : skillData.damage;
            game.damageEnemy(enemy, baseDamage, caster);
        });
        return { type: 'melee', targetsHit: enemies.length };
    }

    static royalSwing(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        const hits = skillData.hits || 3;

        for (let i = 0; i < hits; i++) {
            const hittingEnemies = enemies.slice(i, i + 1);
            hittingEnemies.forEach(enemy => {
                game.damageEnemy(enemy, skillData.damage, caster);
                const knockAngle = Math.atan2(enemy.y - caster.y, enemy.x - caster.x);
                enemy.x += Math.cos(knockAngle) * skillData.knockback;
                enemy.y += Math.sin(knockAngle) * skillData.knockback;
            });
        }

        return { type: 'royalSwing', targetsHit: enemies.length };
    }

    static kingAura(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, 150);
        enemies.forEach(enemy => {
            enemy.slowAmount = skillData.slowAmount;
            enemy.slowDuration = skillData.duration;
            enemy.damageReduction = skillData.damageReduction; // 음수면 피해 증가
        });

        return { type: 'kingAura', affectedEnemies: enemies.length, duration: skillData.duration };
    }

    static royalJudgment(caster, skillData, game) {
        const enemies = game.findEnemiesInRange(caster, skillData.range);
        enemies.forEach(enemy => {
            game.damageEnemy(enemy, skillData.damage, caster);
            const knockAngle = Math.atan2(enemy.y - caster.y, enemy.x - caster.x);
            enemy.x += Math.cos(knockAngle) * skillData.knockback;
            enemy.y += Math.sin(knockAngle) * skillData.knockback;
            enemy.stunned = true;
            enemy.stunDuration = skillData.stun;
        });

        return { type: 'royalJudgment', targetsHit: enemies.length };
    }
}
