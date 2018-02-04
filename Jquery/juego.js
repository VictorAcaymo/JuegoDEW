function juego(dificultad, personaje) {
  const personajes = {
    mago : {
      danio : 10,
      salto : 0.6,
      archivoFisicas : "magoFisicas",
      fisicas : "Mago100x110",
      bala : "balaMago",
      imagen : "magoImg"
    },
    arquero : {
      danio : 7,
      salto : 0.5,
      archivoFisicas : "arqueroFisicas",
      fisicas : "Elfo",
      bala : "balaArquero",
      imagen : "arqueroImg"
    },
    genio : {
      danio : 5,
      salto : 0.4,
      archivoFisicas: "genioFisicas",
      fisicas : "Genio",
      bala : "balaGenio",
      imagen : "genioImg"
    },
  };
  var dificultad = dificultad;
  var personaje = personaje;
  var game = new Phaser.Game(750, 550, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render});
  $("#menu").hide();
  $("#juego").append(game);

  function preload() {

      game.scale.pageAlignHorizontally = true;

      // Mapa
      game.load.image('suelo', '../Recursos/Suelo.png');
      game.load.image('fondo', '../Recursos/Fondo.png');

      // Personajes
      game.load.spritesheet('mago', '../Recursos/Mago100x110.png', 100, 110, 40);
      game.load.physics('magoFisicas', '../Recursos/mago.json');
      game.load.image('magoImg', '../Recursos/MagoImagen.png');
      game.load.image('balaMago', '../Recursos/bala.png');

      game.load.spritesheet('arquero', '../Recursos/Elfo.png', 55.5, 86, 40);
      game.load.physics('arqueroFisicas', '../Recursos/arquero.json');
      game.load.image('arqueroImg', '../Recursos/ElfoImagen.png');
      game.load.image('balaArquero', '../Recursos/flecha.png');

      game.load.spritesheet('genio', '../Recursos/Genio.png', 95.5, 110, 18);
      game.load.physics('genioFisicas', '../Recursos/genio.json');
      game.load.image('genioImg', '../Recursos/GenioImagen.png');
      game.load.image('balaGenio', '../Recursos/rayo.png');

      // monstruos
      game.load.spritesheet('monsterHydra', '../Recursos/Hydra82x100.png', 85, 100, 6);
      game.load.spritesheet('monsterGargola', '../Recursos/Gargola100x100.png', 98, 98, 7);
      game.load.spritesheet('monsterDragon', '../Recursos/Dragon.png',90, 99, 12);

      // Ataques de los monstruos y efectos
      game.load.spritesheet('BOOM', '../Recursos/Explosion1.png', 64, 58, 15);
      game.load.spritesheet('ataqueSuelo', '../Recursos/Ataque.png', 47.5, 92, 5);
      game.load.spritesheet('bola', '../Recursos/bola_electrica.png', 190, 190, 6);
  }

  var terminar;
  var jumpButton;
  var cursors;
  var player;
  var monstruo;
  var monstruoSprite;
  var fondo;
  var jumpTimer = 0;
  var facing = 'right';
  var yAxis = p2.vec2.fromValues(0, 1);

  var proyectiles;
  var bulletTime = 0;
  var anim;

  var playerColisionGroup;
  var balasColisionGroup;
  var monstruoColisionGroup;
  var sueloColisionGroup;
  var ataquesMonstruo;

  var stateText;

  var result;
  var vidaMonstruo = seleccionDificultad();

  var danio = personajes[personaje]['danio']; // Hace daño 20

  var life;
  var widthLife;
  var totalLife;

  var lives;

  var tiempoIntervalo1;
  var tiempoIntervalo2;
  var intervalo1;
  var intervalo2;
  var pauseInterval = false;

  function create() {

    fondo = game.add.sprite(0, 0, 'fondo');
    fondo.scale.set(1.3);

    // Añadimos las fisicas P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    // Método para detectar las colisiones
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0; // revotar al caer

    //jugadorColision = game.physics.p2.createCollisionGroup();
    monstruoColisionGroup = game.physics.p2.createCollisionGroup();
    balasColisionGroup = game.physics.p2.createCollisionGroup();
    sueloColisionGroup = game.physics.p2.createCollisionGroup();
    playerColisionGroup = game.physics.p2.createCollisionGroup();
    ataquesMonstruo = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();

    // Gravedad
    game.physics.p2.gravity.y = 300;

    // Suelo y plataformas
    static1 = game.add.sprite(150, 530, 'suelo');
    static2 = game.add.sprite(490, 530, 'suelo');
    static3 = game.add.sprite(600, 530, 'suelo');
    plataforma = game.add.sprite(350, 350, 'suelo');
    plataforma.scale.set(0.4);

    player = game.add.sprite(64, game.world.height - 200, personaje);
    if (personaje == "mago")
    {
      // Animaciones mago
      player.animations.add('right', [20, 21, 22, 23, 24, 25, 26, 27], 40, true);
      player.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 40, true);
      player.animations.add('shut', [0, 1, 2, 3, 4, 5, 6], 40, true);
      player.animations.add('dead', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 40, true);
    }
    else {
      if (personaje == "arquero")
      {
        // Animaciones arquero
        player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 40, true);
        player.animations.add('left', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 40, true);
        player.animations.add('shut', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 40, true);
        player.animations.add('dead', [30, 31, 32, 33, 34, 35], 40, true);
      }
      else {
        if (personaje == "genio")
        {
          // Animaciones genio
          player.animations.add('right', [0], 18, true);
          player.animations.add('left', [8], 18, true);
          player.animations.add('shut', [2, 3, 4, 5, 6, 7], 18, true);
          player.animations.add('dead', [9, 10, 11, 12, 13, 14, 15, 16], 18, true);
        }
      }
    }

    monstruo = game.add.sprite(650, 360, monstruoSprite);
    monstruo.scale.set(3);
    anim = monstruo.animations.add('monster');

    game.physics.p2.enable([static1, static2, static3, plataforma, player, monstruo], false);

    static1.body.static = true;
    static1.body.setCollisionGroup(sueloColisionGroup);
    static1.body.collides(playerColisionGroup);
    static2.body.static = true;
    static2.body.setCollisionGroup(sueloColisionGroup);
    static2.body.collides(playerColisionGroup);
    static3.body.static = true;
    static3.body.setCollisionGroup(sueloColisionGroup);
    static3.body.collides(playerColisionGroup);
    plataforma.body.static = true;
    plataforma.body.setCollisionGroup(sueloColisionGroup);
    plataforma.body.collides(playerColisionGroup);
    plataforma.body.collides(balasColisionGroup, balasPlayerHit);

    // Jugador
    player.body.clearShapes();
    player.body.loadPolygon(personajes[personaje]['archivoFisicas'], personajes[personaje]['fisicas']);
    player.body.setCollisionGroup(playerColisionGroup);
    player.body.collides(sueloColisionGroup);
    player.body.collides(ataquesMonstruo, killPlayer);
    player.body.data.gravityScale = personajes[personaje]['salto'];
    player.body.fixedRotation = true;
    player.body.damping = 0.5;

    // Balas
    // Prueba 1
    proyectiles = game.add.group();
    proyectiles.enableBody = true;
    proyectiles.physicsBodyType = Phaser.Physics.P2JS;
    proyectiles.createMultiple(15, personajes[personaje]['bala']);
    proyectiles.setAll('outOfBoundsKill', true);
    proyectiles.setAll('checkWorldBounds', true);
    proyectiles.forEach(function(proyectil) {
      proyectil.body.setCollisionGroup(balasColisionGroup);
      proyectil.body.collides([monstruoColisionGroup, sueloColisionGroup]);
      proyectil.body.collideWorldBounds = false;
    });

    monstruo.body.setRectangle(80, 230);
    monstruo.body.static = true;
    monstruo.body.setCollisionGroup(monstruoColisionGroup);
    monstruo.body.collides(balasColisionGroup, balasPlayerHitMonster);

    anim.play(5, true); // true para repetir animacion

    // Botones del teclado
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    terminar = game.input.keyboard.addKey(Phaser.Keyboard.E);

    // Ataques del monstruo
    intervalosAtaques();

    // texto fin partida
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '54px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    // vidas jugador
    lives = game.add.group();
    game.add.text(100, 10, 'Vidas : ', { font: '34px Arial', fill: '#fff' });

    for (var i = 0; i < 3; i++)
    {
      var vidaJugador = lives.create(100 + (50 * i), 90, personajes[personaje]['imagen']);
      vidaJugador.anchor.setTo(0.5, 0.5);
      vidaJugador.alpha = 0.6;
    }
  }

  function intervalosAtaques() {
    window.clearInterval(intervalo1);
    window.clearInterval(intervalo2);
    pauseInterval = !pauseInterval;
    if (!pauseInterval)
      return;
    intervalo1 = setInterval(function() {
      var ataqueAire = game.add.sprite(600, 200, 'bola');
      game.physics.p2.enable(ataqueAire, false);
      ataqueAire.body.setCircle(58);
      ataqueAire.body.collideWorldBounds = false;
      ataqueAire.body.data.gravityScale = 0;
      ataqueAire.body.velocity.x = -200;
      ataqueAire.body.velocity.y = 110;
      ataqueAire.body.setCollisionGroup(ataquesMonstruo);
      ataqueAire.body.collides(playerColisionGroup);

      var boom = ataqueAire.animations.add('boom');
      boom.play(10, true);

    }, tiempoIntervalo1);
    intervalo2 = setInterval(function() {
      var ataqueSuelo = game.add.sprite(600, 410, 'ataqueSuelo');
      var boom = ataqueSuelo.animations.add('boom');
      boom.play(10, true);
      ataqueSuelo.scale.set(1.5);
      game.physics.p2.enable(ataqueSuelo, false);
      ataqueSuelo.body.setRectangle(60, 90, 0, 30);
      ataqueSuelo.body.collideWorldBounds = false;
      ataqueSuelo.body.data.gravityScale = 0;
      ataqueSuelo.body.velocity.x = -200;
      ataqueSuelo.body.setCollisionGroup(ataquesMonstruo);
      ataqueSuelo.body.collides(playerColisionGroup);
    }, tiempoIntervalo2);
  }

  function update() {    

    if (cursors.left.isDown)
    {
      player.body.moveLeft(150);
      if (facing != 'left')
      {
        player.animations.play('left');
        facing = 'left';
      }
    }
    else if (cursors.right.isDown)
    {
      player.body.moveRight(150);
      if (facing != 'right')
      {
        player.animations.play('right');
        facing = 'right';
      }
    }
    else if (cursors.up.isDown)
    {
      player.body.velocity.x = 0;
      fireBullet();
      if (facing != 'up')
      {
        player.animations.play('shut');
        facing = 'up';
      }
    }
    else
    {
      player.body.velocity.x = 0;

      if (facing != 'idle')
      {
          player.animations.stop();
          facing = 'idle';
      }
    }

    if (jumpButton.isDown && game.time.now > jumpTimer && checkIfCanJump())
    {
      player.body.moveUp(300);
      jumpTimer = game.time.now + 750;
    }

    if (terminar.isDown)
    {
      location.reload();
    }
  }

  function render() {
    game.debug.text("Vida monstruo: " + vidaMonstruo, 400, 40, 'white', '34px Arial');
  }

  function fireBullet () {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
      //  Grab the first bullet we can from the pool
      proyectil = proyectiles.getFirstExists(false);

      if (proyectil)
      {
        //  And fire it
        proyectil.reset(player.x + 8, player.y);
        //proyectil.body.onBeginContact.add(hitMonster, this);
        proyectil.body.velocity.x = 400;
        proyectil.body.data.gravityScale = 0;
        bulletTime = game.time.now + 200;
      }
    }
  }

  function killPlayer(body1, body2)
  {
    body2.sprite.kill();
    live = lives.getFirstAlive();

    if (live)
    {
      live.kill();
    }

    if (lives.countLiving() < 1)
    {

    player.animations.play('dead', 10, false);

    setTimeout( function() {
      body1.sprite.kill();
      detenerAtaques();
      stateText.text=" GAME OVER \n Click to restart \n Pulsa E para terminar";
      stateText.visible = true;

      game.input.onTap.addOnce(restart,this);

      }, 1000);
    }
  }

  function detenerAtaques() {
    pauseInterval = true;
  }

  function restart() {
    lives.callAll('revive');
    player.revive();
    monstruo.revive();
    player.animations.stop();
    vidaMonstruo = seleccionDificultad();
    pauseInterval = false;
    stateText.visible = false;
  }

  function balasPlayerHit(body1, body2) {
    body2.sprite.kill();
  }

  function balasPlayerHitMonster(body1, body2) {
    body2.sprite.kill();

    vidaMonstruo -= danio;

    if (vidaMonstruo <= 0)
    {
      var explosion = game.add.sprite(530, 240, 'BOOM');
      explosion.scale.set(4);
      var boom = explosion.animations.add('boom');
      boom.play(50, false);
      body1.sprite.kill();
      detenerAtaques();
      stateText.text="Win \n Click to restart \n Pulsa E para terminar";
      stateText.visible = true;

      if (terminar.isDown)
      {
        location.reload();
      }

      game.input.onTap.addOnce(restart,this);
    }
  }

  function checkIfCanJump()
  {
    var result = false;

    for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
      var c = game.physics.p2.world.narrowphase.contactEquations[i];

      if (c.bodyA === player.body.data || c.bodyB === player.body.data)
      {
          var d = p2.vec2.dot(c.normalA, yAxis);

          if (c.bodyA === player.body.data)
          {
              d *= -1;
          }

          if (d > 0.5)
          {
              result = true;
          }
      }
    }
    return result;
  }

  function seleccionDificultad() {
    if (dificultad == "Facil")
    {
       monstruoSprite = "monsterHydra";
       tiempoIntervalo1 = 8000;
       tiempoIntervalo2 = 6000;
       return 1000;
    }
    else {
      if (dificultad == "Medio")
      {
        monstruoSprite = "monsterGargola";
        tiempoIntervalo1 = 6000;
        tiempoIntervalo2 = 4000;
        return 2000;
      }
      else {
        monstruoSprite = "monsterDragon";
        tiempoIntervalo1 = 5000;
        tiempoIntervalo2 = 3000;
        return 3000;
      }
    }
  }
}
