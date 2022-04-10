function rectangularCollision({ rectangle1, rectangle2}) {
  return (
  rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
  rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
  rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
  rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
);
}

function determineWinner({player, enemy, timerId}) {
  //Останавливаем таймер
  clearTimeout(timerId);
  document.querySelector('#drow').style.display = 'flex';

  if (player.health == enemy.health) {
      document.querySelector('#drow').innerHTML = 'Drow';
  } else if (player.health > enemy.health) {
      document.querySelector('#drow').innerHTML = 'Player 1 Win';
  } else if (player.health < enemy.health)
      document.querySelector('#drow').innerHTML = 'Player 2 Win';
  }


let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    //Устанавливаем таймер. Функция возвращает его айди
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    //Тут мы выставляем отображение таймера внутри блока див на нашей страничке
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({player, enemy, timerId});
  }
}
