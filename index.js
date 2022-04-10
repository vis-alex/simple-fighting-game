const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

//Create rectangle in canvas context. 1 arg - x , 2 - y , 3 - rectangle width, 4 - rectangle height
//We doing it for changing background in browser
c.fillRect(0, 0, canvas.width, canvas.height);

//Константа для ускорения падения обьекта в воздухе во времени
const gravity = 0.7;

//это наш фон
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  //   ./img/ потому что мы начинаем внутри index.js а следовательно должны вернуться назад в корень проекта
  imageSrc: './img/background.png'
});

//Это магазин на фоне
const shop = new Sprite({
  position: {
    x: 530,
    y: 128
  },
  //   ./img/ потому что мы начинаем внутри index.js а следовательно должны вернуться назад в корень проекта
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
});

const player = new Fighter({
  position : {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    //тут мы сдвигает позицию оружия в нужное нам место на экране
    offset: {
      x: 100,
      y: 50
    },
    width: 140,
    height: 50
  }
});

const enemy = new Fighter({
  position : {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
});

//Добавили эту константу чтобы проверять нажата ли клавиша или нет
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
};

decreaseTimer();

function animate() {
    //этот метод вызывает отрисовку кадра - фрейма на окне
    window.requestAnimationFrame(animate);
    //Этот метод чистит наш canvas
    // c.clearRect(0, 0, canvas.width, canvas.height);

    //Устанавливаем черным фон. Потом он меняется в методе draw() на красный для отрисовки игроков
    // c.fillStyle = 'black';
    // c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    //добавляем подсветку для моделей игроков. Три значения 255  для красного синего зеленого дают нам белый. Последнйи аргумент - прозрачность
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();
//Устанавливаем значение x по дефолту для каждого кадра ноль, чтобы он не двигался если мы не нажимаем кнопку
    player.velocity.x = 0;
    enemy.velocity.x = 0;

//движения игрока влево вправо. Стояние на месте
//Сделано это для того чтобы можно было жать кнопки одновременно двум игрокам

    if (keys.a.pressed && player.lastKey == 'a') {
      player.velocity.x = -5;
      player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') {
      player.velocity.x = 5;
      player.switchSprite('run');
    } else {
      player.switchSprite('idle');
    }

//прыжок и падение. То есть если у нас скорость мнеьше нуля - значит отрицательная гравитация мы взымываем вверх, если положитедльная то падаем вниз.
    if (player.velocity.y < 0) {
      player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall');
    }

      //движения врага
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
      enemy.velocity.x = -5;
      enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
      enemy.velocity.x = 5;
      enemy.switchSprite('run');
    } else {
      enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
      enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite('fall');
    }

    //Определяем пересечение игроков
    if (
     rectangularCollision({
       rectangle1: player,
       rectangle2: enemy
      }) &&
      //Это делается для того чтобы хп отнималось только в момент атаки (4 - это момент когда меч посередине модели врага)
     player.isAttacking && player.framesCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.takeHit();
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'; - старый способ

        //метод скачанной скриптом сторонней библиотеки для того чтобы полоска хп убалялась постепенно
        //первый аргумент - нужный элемент, второй - функция описывающая как он должен изменяться
        gsap.to('#enemyHealth', {
          width: enemy.health + '%'
        })
     }

     //Это проверка если игрок промахивается. То есть если не прошло первую проверку то isAttaking не выставится в false
     if (player.isAttacking && player.framesCurrent === 4) {
       player.isAttacking = false;
     }

     if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
       }) &&
      enemy.isAttacking && enemy.framesCurrent === 2
     ) {
         enemy.isAttacking = false;
         player.takeHit();
         //document.querySelector('#playerHealth').style.width = player.health + '%';

         gsap.to('#playerHealth', {
           width: player.health + '%'
         })
      }

      if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
      }

      if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
      }
}

animate();



//Тут мы добавляем обработчика событий для нажатия клавиши
window.addEventListener('keydown', (event) => {
  //event.key - это свойство обьекта event отвечающее за название нажатой кнопки
  // console.log(event.key);

    if (!player.dead) {
      switch(event.key) {
        case 'd' :
            player.lastKey = 'd';
            keys.d.pressed = true;
            break;
        case 'a' :
            player.lastKey = 'a';
            keys.a.pressed = true;
            break;
        case 'w' :
            if (player.velocity.y === 0) {
              player.velocity.y -= 20;
            }
            break;
        case ' ' :
            player.attack();
            break;
      }
    }

    if (!enemy.dead) {
      switch(event.key) {
        case 'ArrowRight' :
          enemy.lastKey = 'ArrowRight';
          keys.ArrowRight.pressed = true;
          break;
        case 'ArrowLeft' :
          enemy.lastKey = 'ArrowLeft';
          keys.ArrowLeft.pressed = true;
          break;
        case 'ArrowUp' :
          if (enemy.velocity.y === 0) {
            enemy.velocity.y -= 20;
          }
          break;
        case 'ArrowDown' :
          enemy.attack();
          break;
     }
   }
})
//Тут мы добавляем обработчика событий для отжатия клавиши
window.addEventListener('keyup', (event) => {

  switch(event.key) {
    case 'd' :
        keys.d.pressed = false;
        break;
    case 'a' :
        keys.a.pressed = false;
        break;

    case 'ArrowRight' :
        keys.ArrowRight.pressed = false;
        break;
    case 'ArrowLeft' :
        keys.ArrowLeft.pressed = false;
        break;
  }
})
