class Sprite {
  //Так мы устанавливаем значения по дефолту
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }}) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    //Это коэффициент увеличения изображения
    this.scale = scale;
    //Максимально количество каждров картинки. Используем для разбиения изображения на части. Для фона и магазина будут разные коэффициенты
    this.framesMax = framesMax;
    //Этот аргумент показывает на текущий фрейм(кадр) для сдвига
    this.framesCurrent = 0;
    //Это нужно для того чтобы анимация дыма в shop была контролируема нами(ее скорость)
    this.framesElapsed = 0;
    this.framesHold = 7;
    //Это свойство нужно для того, чтобы правильно размещать картинку на canvas. Например учитывать пустое пространство вокруг моделей игроков
    this.offset = offset;
  }

  draw() {
    //Функция для отрисовки на canvas картинки. Изображение, начальная точка х, начальная точка у, ширина изображения, высота изображения
    c.drawImage(
      this.image,

      //В аргументах после image идут 4 точки для обрезания изображения shop и создания иллюзии анимации
      //Второй аргумент показывает на сколько мы сдвигаем по оси x вдоль вырезаемого куска кратинки
      this.framesCurrent * this.image.width / this.framesMax,
      0,
      this.image.width / this.framesMax,
      this.image.height,

      //Это позиции куда мы помещаем нашу картинку. Мы вычитаем offset для того чтобы модели игроков были на уровне земли
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      this.image.width / this.framesMax * this.scale,
      this.image.height * this.scale);
  }

  animateFrames() {
    this.framesElapsed++;
    //Эта часть кода для того чтобы зациклитьобрезание картинки, чтобы показывать ее по частям и сделать видимость анимации
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else this.framesCurrent = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }

}

class Fighter extends Sprite{
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    //специальный обьект в котором будут хроаниться все  spites для этого бойца
    sprites,
    //свойство для оружия
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined
    }
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.position = position;
    //скорость движения
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    //Последняя нажатая кнопка
    this.lastKey;
    this.color = color;
    //это оружие игроков. Оно прикреплено к позиции самого игрока и перемещается вместе с ним
    this.attackBox = {
      position: {
        x: this.position.x ,
        y: this.position.y
      },
      //Тут тот же самый аргумент который передается в конструкторе
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    };
    //Свойство для проверки атакует ли наш персонаж
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.sprites = sprites;
    this.dead = false;

//Такой синтаксис для обозначения переменной в цикле. Не забываем const или let
    for (const sprite in this.sprites) {
      //так можно выбрать поле - обьект в sprites.а потом добавить новое свойство
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

  }

  update() {
    this.draw();

    if (!this.dead) {
     this.animateFrames();
    }

    //Это сделано для того чтобы наше оружие передвигалось вместе с моделью игрока
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //Для проверки где нахождится оружие на самом деле
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //Функция гравитации.  canvas.height(высота экрана сверху вниз) - 97 - это точка до достижения которой есть скорость падения.
    //this.position.y + this.height + this.velocity.y - это точка где нарисована земля. Если расположение модели плюс ускорени ниджже земли - останавливаемся
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 97) {
      this.velocity.y = 0;
      //Устанавливаем чтоб стоял ровно на земле
      this.position.y = 330
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite('attack1');
    this.isAttacking = true;
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    //Это делается для того чтобы если мы атакуем то не выполнялся код про движение игрока в котором мы если не двигаемся  то точно стоим
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1) return;

      //Это делается для того чтобы если мы получали анимацию получения урона, то анимацяи стояния не выполнялась
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;

    switch (sprite) {
      case 'idle':
        if (this.image != this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          //Это вставляем везде чтобы  при переключении анимации она начиналась с 0 кадра.
          this.framesCurrent = 0;
        }
        break;
      case 'run':
         if (this.image != this.sprites.run.image) {
           this.image = this.sprites.run.image;
           this.framesMax = this.sprites.run.framesMax;
           this.framesCurrent = 0;
         }
         break;
      case 'jump':
         if (this.image != this.sprites.jump.image) {
           this.image = this.sprites.jump.image;
           this.framesMax = this.sprites.jump.framesMax;
           this.framesCurrent = 0;
         }
         break;
        case 'fall':
          if (this.image != this.sprites.fall.image) {
            this.image = this.sprites.fall.image;
            this.framesMax = this.sprites.fall.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case 'attack1':
          if (this.image != this.sprites.attack1.image) {
            this.image = this.sprites.attack1.image;
            this.framesMax = this.sprites.attack1.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case 'takeHit':
          if (this.image != this.sprites.takeHit.image) {
            this.image = this.sprites.takeHit.image;
            this.framesMax = this.sprites.takeHit.framesMax;
            this.framesCurrent = 0;
          }
          break;
        case 'death':
          if (this.image != this.sprites.death.image) {
            this.image = this.sprites.death.image;
            this.framesMax = this.sprites.death.framesMax;
            this.framesCurrent = 0;
          }
          break;
    }
  }

  takeHit() {
    this.health -= 10;

    if (this.health <= 0) {
      this.switchSprite('death');
    } else {
      this.switchSprite('takeHit');
    }
  }
}
