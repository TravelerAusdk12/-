/**
 * 체스 배틀 캐릭터 정의 (개선 버전)
 * 각 기물이 고유한 메커니즘을 가짐
 */

const CHARACTERS = {
    // 💎 폰: 느린 공격속도, 하나의 강한 공격, 프로모션 시스템
    PAWN: {
        id: 'pawn',
        name: '폰',
        emoji: '♟️',
        description: '공격은 느리지만 강력. 프로모션으로 변신 가능!',
        color: '#95a5a6',
        baseStats: {
            maxHp: 50,
            maxMana: 60,
            speed: 140,
            attackDamage: 25,
            attackRange: 80,
            attackSpeed: 0.4 // 매우 느림
        },
        passive: {
            name: '프로모션',
            description: '적 기지에 도달하면 강력한 기물로 변신',
            effect: 'promotion'
        },
        skills: {
            basic: {
                name: '강력한 일격',
                description: '느리지만 매우 강력한 공격',
                damage: 25,
                range: 80,
                cooldown: 0,
                knockback: 50
            },
            skill1: {
                name: '돌진 공격',
                key: 'Q',
                description: '앞으로 돌진하며 강한 피해를 입힌다',
                damage: 30,
                range: 200,
                cooldown: 6,
                manaCost: 40,
                effect: 'dashAttack',
                knockback: 100
            },
            skill2: {
                name: '방패 방어',
                key: 'E',
                description: '방어력을 크게 증가시킨다',
                cooldown: 8,
                manaCost: 35,
                duration: 3,
                effect: 'shield',
                damageReduction: 0.4
            },
            ultimate: {
                name: '필승의 일격',
                key: 'R',
                description: '모든 에너지를 한 곳에 집중시킨 최강의 공격',
                damage: 50,
                range: 100,
                cooldown: 15,
                manaCost: 80,
                effect: 'ultimateStrike',
                knockback: 200,
                stun: 0.5
            }
        }
    },

    // 🐴 나이트: 돌진 거리에 비례한 데미지
    KNIGHT: {
        id: 'knight',
        name: '나이트',
        emoji: '♞',
        description: '돌진 거리가 길수록 강한 공격! 거리의 예술가',
        color: '#3498db',
        baseStats: {
            maxHp: 70,
            maxMana: 90,
            speed: 180,
            attackDamage: 14,
            attackRange: 100,
            attackSpeed: 0.9
        },
        passive: {
            name: '거리 계산',
            description: '돌진 거리에 비례해서 데미지 증가 (최대 3배)',
            effect: 'distanceDamage'
        },
        skills: {
            basic: {
                name: '빠른 칼질',
                description: '기본 검 공격',
                damage: 14,
                range: 100,
                cooldown: 0
            },
            skill1: {
                name: '충전 돌진',
                key: 'Q',
                description: '멀리 돌진할수록 강한 피해! 최대 거리 250px',
                damage: 20,
                range: 250,
                cooldown: 5,
                manaCost: 35,
                effect: 'chargeThrust',
                maxDamageMultiplier: 3.0 // 거리에 따라 1배~3배
            },
            skill2: {
                name: '기민한 회피',
                key: 'E',
                description: '빠르게 움직여 공격을 회피한다',
                cooldown: 6,
                manaCost: 30,
                duration: 2,
                effect: 'evasion',
                dodgeChance: 0.7 // 70% 회피율
            },
            ultimate: {
                name: '궁극의 돌진',
                key: 'R',
                description: '최대 거리로 돌진해 엄청난 피해를 준다',
                damage: 40,
                range: 300,
                cooldown: 18,
                manaCost: 90,
                effect: 'ultCharge',
                maxDamageMultiplier: 5.0,
                knockback: 180
            }
        }
    },

    // 🔮 비숍: 마법 중심
    BISHOP: {
        id: 'bishop',
        name: '비숍',
        emoji: '♗',
        description: '마법 능력이 뛰어난 원거리 마법사',
        color: '#9b59b6',
        baseStats: {
            maxHp: 55,
            maxMana: 150,
            speed: 150,
            attackDamage: 12,
            attackRange: 220,
            attackSpeed: 1.1
        },
        passive: {
            name: '마법 전문가',
            description: '모든 마법 피해 +25%, 마나 회복 +3/초',
            effect: 'magicMastery'
        },
        skills: {
            basic: {
                name: '마법 화살',
                description: '마법 에너지 미사일 발사',
                damage: 14,
                range: 220,
                cooldown: 0,
                isMagic: true
            },
            skill1: {
                name: '마법 폭발',
                key: 'Q',
                description: '지정 위치에 마법 폭발을 일으킨다',
                damage: 32,
                range: 280,
                cooldown: 4,
                manaCost: 50,
                effect: 'magicBurst',
                aoeRadius: 100,
                isMagic: true
            },
            skill2: {
                name: '마나 방패',
                key: 'E',
                description: '마나로 만든 방패가 피해를 흡수한다',
                cooldown: 7,
                manaCost: 60,
                duration: 4,
                effect: 'manaShield',
                shieldAmount: 40,
                isMagic: true
            },
            ultimate: {
                name: '메테오 스톰',
                key: 'R',
                description: '하늘에서 운석이 내려와 대지를 갈아버린다',
                damage: 45,
                range: 300,
                cooldown: 20,
                manaCost: 120,
                effect: 'meteorStorm',
                strikes: 8,
                aoeRadius: 80,
                isMagic: true
            }
        }
    },

    // 🛡️ 룩: 절대 방어
    ROOK: {
        id: 'rook',
        name: '룩',
        emoji: '♖',
        description: '절대 방어! 이 벽을 넘을 수 없다',
        color: '#e74c3c',
        baseStats: {
            maxHp: 140,
            maxMana: 70,
            speed: 110,
            attackDamage: 16,
            attackRange: 110,
            attackSpeed: 0.7
        },
        passive: {
            name: '절대 방어',
            description: '모든 받는 피해 -50%, 반사 피해 50%',
            effect: 'absoluteDefense'
        },
        skills: {
            basic: {
                name: '강력한 타격',
                description: '무겁고 강력한 공격',
                damage: 18,
                range: 110,
                cooldown: 0
            },
            skill1: {
                name: '방어 자세',
                key: 'Q',
                description: '완벽한 방어 자세로 받는 피해 -80%',
                cooldown: 6,
                manaCost: 40,
                duration: 3,
                effect: 'defensiveStance',
                damageReduction: 0.8 // 80% 감소
            },
            skill2: {
                name: '반사의 벽',
                key: 'E',
                description: '벽을 생성해 모든 피해를 반사한다',
                cooldown: 10,
                manaCost: 70,
                duration: 2,
                effect: 'reflectWall',
                reflectPercent: 1.0 // 100% 반사
            },
            ultimate: {
                name: '절대 방어막',
                key: 'R',
                description: '절대로 부서지지 않는 방어막을 펼친다',
                cooldown: 22,
                manaCost: 100,
                duration: 5,
                effect: 'absoluteBarrier',
                damageReduction: 0.95, // 95% 감소
                teamProtection: true // 팀원도 보호
            }
        }
    },

    // 👑 퀸: 극도로 빠른 공격속도
    QUEEN: {
        id: 'queen',
        name: '퀸',
        emoji: '♕',
        description: '공격속도가 엄청 빠른 딜러! 연속 공격의 여왕',
        color: '#f39c12',
        baseStats: {
            maxHp: 75,
            maxMana: 110,
            speed: 190,
            attackDamage: 11,
            attackRange: 140,
            attackSpeed: 2.5 // 매우 빠름 (기본의 2.5배)
        },
        passive: {
            name: '연속 공격',
            description: '연속 공격할 때마다 데미지 +10% (최대 5배)',
            effect: 'comboAttack'
        },
        skills: {
            basic: {
                name: '빠른 참격',
                description: '엄청나게 빠른 연속 공격',
                damage: 11,
                range: 140,
                cooldown: 0,
                attackSpeed: 2.5
            },
            skill1: {
                name: '칼날 회오리',
                key: 'Q',
                description: '주변을 칼날로 휘감아 모든 적을 공격한다',
                damage: 16,
                range: 130,
                cooldown: 3,
                manaCost: 40,
                effect: 'bladeStorm',
                hits: 6 // 6번 공격
            },
            skill2: {
                name: '가속',
                key: 'E',
                description: '공격속도 +100%, 이동속도 +50%',
                cooldown: 7,
                manaCost: 50,
                duration: 3,
                effect: 'haste',
                attackSpeedMultiplier: 2.0,
                speedMultiplier: 1.5
            },
            ultimate: {
                name: '천 번의 칼날',
                key: 'R',
                description: '고속으로 몇 십 번을 공격한다',
                damage: 12,
                range: 120,
                cooldown: 14,
                manaCost: 100,
                effect: 'thousandBlades',
                hits: 20 // 20번 공격!
            }
        }
    },

    // 🤴 킹: 근접 갈아버림
    KING: {
        id: 'king',
        name: '킹',
        emoji: '♔',
        description: '근접전 최강! 주변의 모든 근접 적을 갈아버린다',
        color: '#2ecc71',
        baseStats: {
            maxHp: 120,
            maxMana: 95,
            speed: 160,
            attackDamage: 20,
            attackRange: 90,
            attackSpeed: 1.2
        },
        passive: {
            name: '근접 주인',
            description: '근접 범위(90px) 내 적에게 +50% 데미지',
            effect: 'meleemaster'
        },
        skills: {
            basic: {
                name: '왕의 검',
                description: '근접 적들에게 강한 타격',
                damage: 22,
                range: 90,
                cooldown: 0,
                effect: 'melee'
            },
            skill1: {
                name: '왕권 휘두르기',
                key: 'Q',
                description: '주변을 갈아버리며 모든 근접 적을 밀어낸다',
                damage: 28,
                range: 120,
                cooldown: 5,
                manaCost: 45,
                effect: 'royalSwing',
                knockback: 150,
                hits: 3 // 3명의 적을 동시에 공격
            },
            skill2: {
                name: '왕의 아우라',
                key: 'E',
                description: '왕의 힘으로 근처 모든 적을 약화시킨다',
                cooldown: 8,
                manaCost: 50,
                duration: 4,
                effect: 'kingAura',
                slowAmount: 0.6,
                damageReduction: -0.3 // 받는 피해 +30%
            },
            ultimate: {
                name: '왕의 심판',
                key: 'R',
                description: '주변의 모든 근접 적을 압살한다',
                damage: 50,
                range: 150,
                cooldown: 18,
                manaCost: 120,
                effect: 'royalJudgment',
                knockback: 250,
                stun: 1.0
            }
        }
    }
};

// 캐릭터 ID로 데이터 가져오기
function getCharacterData(characterId) {
    return Object.values(CHARACTERS).find(char => char.id === characterId);
}

// 모든 캐릭터 목록 가져오기
function getAllCharacters() {
    return Object.values(CHARACTERS);
}

// 캐릭터 이름으로 데이터 가져오기
function getCharacterByName(name) {
    return Object.values(CHARACTERS).find(char => char.name === name);
}
