// todo
// boiling mine magic immune & boss
// temple acronian cultist
// heavy armor ability

var poisonsword = "poison sword"
var vigorsword = "vigor sword"
var aethersword = "aether sword"
var firesword = "fire sword"
var icesword = "ice sword"
var mainsword = aethersword

var bashingshield = "bashing shield"
var compoundshield = "compound shield 10*"

var poisonwand = "poison wand"
var vigorwand = "vigor wand"
var aetherwand = "aether wand"
var firewand = "fire wand"
var icewand = "ice wand"
var mainmagicalranged = aetherwand
var altmagicalranged = vigorwand

var stonehammer = "stone hammer"
var poisonhammer = "poison hammer"
var mainhammer = poisonhammer
var heavyhammer = "heavy hammer 10*"

var minCombatDistance = 30
var minfoeforblade = 10

func isInCombat()
  return foe.count > 0 & foe.distance <= minCombatDistance & ai.enabled

func isInState(stateNum, stateTime)
  return foe.state = stateNum & foe.time >= stateTime

func activatePotion()
  ?item.CanActivate()
    activate P

func equiplMind()
  ?item.GetCooldown("mind") <= 0
    equipL mind

func displayfoestuff()
  ?time % 15 = 0 // every half s
    > @foe.state@ @foe.time@

func equipBlade()
  ?item.GetCooldown("blade") <= 0 & item.canActivate()
    equip blade
    activate R

func equipTal()
  ?item.CanActivate()
    ?item.GetCooldown("aether_talisman") <= 0
      equipR aether_talisman
      activate R
    :?item.GetCooldown("fire_talisman") <= 0
      equipR fire_talisman
      activate R

func heavyHammer()
  ?item.CanActivate()
  ^& item.GetCooldown("heavy_hammer")<=0
    equip @heavyhammer@
    activate R
    > hello heavy

func aac()
  ?item.left.state = 3
    equipL *0 wand //trash
    equipL @item.left@
  ?item.right.state = 3
    equipR *0 shield //trash
    equip @item.right@

// aac
aac()

// loc : potion
?loc.begin
  ?loc = Mushroom Forest | loc = caves of fear
    brew tar + bronze // vampiric
  :?loc = temple | loc = rocky plateau
    brew wood + bronze // berserk
  :?loc = icy ridge
  ^|loc = haunted halls
    brew wood + tar // cleansing
  :?loc = deadwood canyon
    brew wood + stone // invisibility

?isInCombat() & summon.count = 0
  equipTal()

?isInCombat() & summon.count > 0

  ?foe ! dysangelos | foe ! phase3
    ?foe = vigor
      mainsword = poisonsword
      mainmagicalranged = poisonwand
    :?foe = aether
      mainsword = vigorsword
      mainmagicalranged = vigorwand
      altmagicalranged = aetherwand
    :?foe = fire
      mainsword = aethersword
      mainmagicalranged = aetherwand
    :?foe = ice
      mainsword = firesword
      mainmagicalranged = firewand
    :?foe = poison
      mainsword = icesword
      mainmagicalranged = icewand

  ?foe.distance > 8
    equipR @altmagicalranged@
    equipL @mainmagicalranged@
    ?foe.count > minfoeforblade
      equipBlade()
  :
    equipR @compoundshield@
    equipL @mainsword@

// specific foe
  ?foe = ice pillar | foe = ice wall
  ^|foe = acronian scout
    equipR @compoundshield@
    equipL @mainsword@
  ?foe = scarab
    ?foe.debuffs.string ! debuff_armor_fatigue
      heavyHammer()
    :
      equipR @compoundshield@
      equipL @mainsword@
  ?foe = ghost
    equipR @altmagicalranged@
    equipL @mainmagicalranged@
  ?foe = cult sorcerer | foe = elemental
  ^|foe = minotaur
    equipR @compoundshield@
    equipL @mainmagicalranged@
  ?foe = ceiling decorator
    ?foe.debuffs.string ! stun & debuffs.string ! debuff_damage
      equipL @mainhammer@
    :
      equipL @mainsword@
    ?foe.distance > 6
      equipR @bashingshield@
    :
      equipR @compoundshield@
  ?foe = bomb cart
    equipR @altmagicalranged@
    equipL @mainmagicalranged@
    ?foe.distance < 6
      equiplMind()

// boss
  ?foe = xyloalgia
    equipR @compoundshield@
    equipL @mainmagicalranged@
   // ?isInState(33, 4)
   //   equiplMind()
  ?foe = poena
    equipL Grappling Hook
    ?foe.distance > 5
      equipR @bashingshield@
    :
      equipR @stonehammer@

    ?isInState(32, 30)
      activatePotion()

  ?foe = angry shroom | foe = morel | foe = enoki
    equipR @compoundshield@
    ?foe.armor > 0
      equipL @mainhammer@
    :
      equipL @mainsword@
  ?foe = morel
    activatePotion()

  ?foe = bolesh
    equipR @altmagicalranged@
    equipL @mainmagicalranged@
    ?hp < (maxhp / 2)
      equipR @compoundshield@
    ?foe.hp < (foe.maxhp / 3)
      activatePotion()

  var pallasphtwo = false
  ?foe = pallas
    equipR @compoundshield@
    equipL @mainsword@
    ?foe = phase2
      pallasphtwo = true
  ?pallasphtwo = true
    equipL @mainmagicalranged@
    equipR @compoundshield@
    ?debuffs.GetCount("pallas_phase2_debuff") > 2
      activatePotion()

  ?foe = bronze_guardian
    equipR @altmagicalranged@
    equipL @mainmagicalranged@
    ?isInState(32, 10)
      equiplMind()

  ?foe = yeti
    equipL @mainmagicalranged@
    ?armor < 10
      equipR @compoundshield@
    :
      equipR @altmagicalranged@
    ?foe.armor > 0
      equipL @mainhammer@
    ?debuffs.string = yeti_chill
      activatePotion()

  ?foe = nagaraja
    equipR @mainmagicalranged@
    equipL @mainsword@
    activatePotion()
    ?isInState(112, 53)
      equiplMind()

  ?foe = dysangelos
    equipR @compoundshield@
    ?foe = phase1
      ?foe.debuffs.string = debuff_damage
        equipL @icesword@
      :
        equipL @poisonsword@
    ?foe = phase2
      equipL @mainsword@
    ?foe = phase3
      ?foe.buffs.string ! adaptive_defense_poison
        mainsword = poisonsword
      :?foe.buffs.string ! adaptive_defense_ice
        mainsword = icesword
      :?foe.buffs.string ! adaptive_defense_aether
        mainsword = aethersword
      :?foe.buffs.string ! adaptive_defense_fire
        mainsword = firesword
      :?foe.buffs.string ! adaptive_defense_vigor
        mainsword = vigorsword
      equipL @mainsword@
      ?foe.armor > 0
        equipL @stonehammer@
        ?foe.damage < 5
          equipR @mainsword@
          activatePotion()
        heavyHammer()
      ?isInState(32, 40) | isInState(115, 60)
        equiplMind()

?!isInCombat()
  equipR @compoundshield@
  ?ai.walking
    equipL triskelion
  ?pickup.distance < 13
    equipL star
  ?res.stone < 500 & harvest = boulder & harvest.distance < 9
    equip shovel
  ?res.wood < 500 & harvest = tree & harvest.distance < 9
    equip shovel
  ?hp < maxhp
    equipL ouroboros
