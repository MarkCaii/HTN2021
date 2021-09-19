var state = [];
let Events = [];

function setDefaultState() {
  var id = generateID();
  var baseState = {};
  baseState[id] = {
    title: "Example Task",
    hours: 2,
    priority: 1,
    id: id,
  };
  syncState(baseState);
}

function generateID() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}

function pushToState(title, hours, priority, id) {
  var baseState = getState();
  baseState[id] = { title: title, hours: hours, priority: priority, id: id, };
  syncState(baseState);
}

function deleteTask(id) {
  console.log(id)
  var baseState = getState();
  delete baseState[id]
  syncState(baseState)
}

function resetState() {
  localStorage.setItem("state", null);
}

function syncState(state) {
  localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
  return JSON.parse(localStorage.getItem("state"));
}

function addItem(text, hours, priority, id) {
  var id = id ? id : generateID();
  var strPriority = "";
  if(parseInt(priority) == 2){
    strPriority = "high";
  }else if(parseInt(priority) == 1){
    strPriority = "medium";
  } else{
    strPriority = "low";
  }
  var item =
    '<li data-id="' +
    id +
    '"><div class="task"><span class="close"><i class="fa fa-times"></i></span><label>' +
    text + ' for ' + hours + ' hour, ' + strPriority + ' priority'
    "</label></div></li>";

  var isError = $(".form-control").hasClass("hidden");

  if (text === "") {
    $(".err")
      .removeClass("hidden")
      .addClass("animated bounceIn");
  } else {
    $(".err").addClass("hidden");
    $(".todo-list").append(item);
  }

  $(".refresh").removeClass("hidden");

  $(".no-items").addClass("hidden");

  $(".form-control")
    .val("")
    .attr("placeholder", "✍️ Add item...");
  setTimeout(function () {
    $(".todo-list li").removeClass("animated flipInX");
  }, 500);

  pushToState(text, hours, priority, id);
}

function refresh() {
  $(".todo-list li").each(function (i) {
    $(this)
      .delay(70 * i)
      .queue(function () {
        $(this).addClass("animated bounceOutLeft");
        $(this).dequeue();
      });
  });

  setTimeout(function () {
    $(".todo-list li").remove();
    $(".no-items").removeClass("hidden");
    $(".err").addClass("hidden");
  }, 800);
}

var modal = document.getElementById("taskInfoForm");

var btn = document.getElementById("addTaskButton");

var span = document.getElementsByClassName("close")[0];

var closeBtn = document.getElementById("btn");

var sortBtn = document.getElementById("showCalendar");

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

sortBtn.onclick = function () {
  
  bubbleSort(Events, Events.length)
  var date = new Date();
  var options = { hour12: false };
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = String(date.getFullYear());
  var currentTime = 8;

  Events.forEach(element => {
    var temp = parseInt(currentTime)

    var temp2 = parseInt(temp) + parseInt(element.HOURS);
    var event = {
      'summary': element.EVENT,
      'start':{

        'dateTime': yyyy+'-'+mm+'-'+dd+'T'+String(temp).padStart(2,'0')+':'+'00:00-04:00',
      },
      'end': {

        'dateTime': yyyy+'-'+mm+'-'+dd+'T'+String(temp2).padStart(2,'0')+':'+'00:00-04:00',
      },
    };
    currentTime = parseInt(temp2)
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });

    request.execute(function(event) {
      appendPre('Event created: ' + event.summary);
    });
  });
  location.reload();
}

closeBtn.onclick = function () {
  let task = {
    id: Date.now(),
    EVENT: document.getElementById('event').value,
    HOURS: document.getElementById('time').value,
    PRIORITY: document.getElementById('priorities').value
  }
  Events[task.id] = task
  Events.push(task)
  var string = ''
  Events.forEach(element => {
    string += 'Event Name: ' + element.EVENT + '\n' + 'Number of Hours: ' + element.HOURS + '\n' + 'Priority Level: ' + element.PRIORITY + '\n'
  });
  localStorage.setItem('MyMovieList', JSON.stringify(Events));

  modal.style.display = "none";
  var title = document.getElementById("event").value
  var hours = document.getElementById("time").value
  var priority = document.getElementById("priorities").value
  document.forms[0].reset();
  addItem(title, hours, priority)
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$(function () {
  var err = $(".err"),
    formControl = $(".form-control"),
    isError = formControl.hasClass("hidden");

  if (!isError) {
    formControl.blur(function () {
      err.addClass("hidden");
    });
  }

  $(".add-btn").on("click", function () {
    var itemVal = $(".form-control").val();
    addItem(itemVal);
    formControl.focus();
  });

  $(".refresh").on("click", refresh);

  $(".todo-list").on("click", 'input[type="checkbox"]', function () {
    var li = $(this)
      .parent()
      .parent()
      .parent();
    li.toggleClass("danger");
    li.toggleClass("animated flipInX");

    setToDone(li.data().id);

    setTimeout(function () {
      li.removeClass("animated flipInX");
    }, 500);
  });

  $(".todo-list").on("click", ".close", function () {
    var box = $(this)
      .parent()
      .parent();

    if ($(".todo-list li").length == 1) {
      box.removeClass("animated flipInX").addClass("animated                bounceOutLeft");
      setTimeout(function () {
        box.remove();
        $(".no-items").removeClass("hidden");
        $(".refresh").addClass("hidden");
      }, 500);
    } else {
      box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
      setTimeout(function () {
        box.remove();
      }, 500);
    }

    deleteTask(box.data().id)
  });

  $(".form-control").keypress(function (e) {
    if (e.which == 13) {
      var itemVal = $(".form-control").val();
      addItem(itemVal);
    }
  });
  $(".todo-list").sortable();
  $(".todo-list").disableSelection();
});

var todayContainer = document.querySelector(".today");


var d = new Date();


var weekday = new Array(7);
weekday[0] = "Sunday 🖖";
weekday[1] = "Monday 💪😀";
weekday[2] = "Tuesday 😜";
weekday[3] = "Wednesday 😌☕️";
weekday[4] = "Thursday 🤗";
weekday[5] = "Friday 🍻";
weekday[6] = "Saturday 😴";


var n = weekday[d.getDay()];


var randomWordArray = Array(
  "Oh my, it's ",
  "Whoop, it's ",
  "Happy ",
  "Seems it's ",
  "Awesome, it's ",
  "Have a nice ",
  "Happy fabulous ",
  "Enjoy your "
);

var randomWord =
  randomWordArray[Math.floor(Math.random() * randomWordArray.length)];


todayContainer.innerHTML = randomWord + n;

$(document).ready(function () {
  var state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach(function (todoKey) {
    var todo = state[todoKey];
    addItem(todo.title, todo.hours, todo.priority, todo.id);
  });
});

function swap(arr, xp, yp)
{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}
// An optimized version of Bubble Sort
function bubbleSort( arr, n)
{
var i, j;
for (i = 0; i < n-1; i++)
{
    for (j = 0; j < n-i-1; j++)
    {
        if (arr[j].PRIORITY < arr[j+1].PRIORITY)
        {
        swap(arr,j,j+1);
        }
    }
}
}