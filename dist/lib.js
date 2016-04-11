'use strict';

var PATH = "/assets/data/data4.json";

var Data = readFromJson(PATH);

var Students = Data.students;
var Groups = Data.groups;
var Tasks = Data.tasks;
var Mentors = Data.mentors;

Students.counter = Students.length;
Groups.counter = Groups.length;
Tasks.counter = Tasks.length;
Mentors.counter = Mentors.length;

function readFromJson(filePath) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', filePath, false);
  xhr.send();

  if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
    return false;
  } else {
    return JSON.parse(xhr.responseText);
  }
}

$(document).ready(function () {

  renderList();
  $('.json-export').click(exportJSON);
  $(document).mousedown(function (e) {
    var groupList = $('.students__group-list');
    var wishlist = $('.wishlist');
    var distribution = $('.distribution');
    var objects = [].concat(groupList, wishlist, distribution);

    objects.forEach(function (elem) {
      if (!elem.is(e.target) && elem.has(e.target).length == 0) elem.fadeOut(200);
    });
  });
  $('.distribution__button').click(onDistributionButtonClick);
  $(document).on('click', '.students__title', function () {
    $('.students__title').addClass('students__title_active');
    $('.students').show();
    $('.mentors__title').removeClass('mentors__title_active');
    $('.mentors').hide();
  });
  $(document).on('click', '.mentors__title', function () {
    $('.mentors__title').addClass('mentors__title_active');
    $('.mentors').show();
    $('.students__title').removeClass('students__title_active');
    $('.students').hide();
  });

  $('.students').on('click', '.students__delete-button', onStudentDeleteClick);
  $('.students').on('click', '.students__add-to-group-button', onStudentAddToGroupClick);
  $('.students').on('click', '.students__expel-button', onStudentExpelClick);
  $('.students').on('click', '.students__group-menu-button', onAddGroupMenuClick);
  $('.students').on('click', '.students__new-group', onAddGroupBtnClick);
  $('.students').on('click', '.students__add-button', onStudentAddClick);
  $('.students').on('click', '.students__add-task-button', onTaskAddClick);
  $('.students').on('click', '.students__delete-group-button', onGroupDeleteClick);
  $('.students').on('click', '.students__expel-all-button', onGroupExpellAllClick);
  $('.students').on('click', '.groups__item-name span', onGroupEditClick);
  $('.students').on('click', '.students__name span', onStudentEditClick);
  $('.students__input').keypress(function (e) {
    return e.which == 13 ? onStudentAddClick() : true;
  });
  $('.students').on('click', '.students__show-wishlist-button', onShowWishListClick);

  $('.mentors').on('click', '.mentors__add-button', onMentorAddClick);
  $('.mentors').on('click', '.mentors__name span', onMentorEditClick);
  $('.mentors').on('click', '.mentors__delete-button', onMentorDeleteClick);
  $('.mentors__input').keypress(function (e) {
    return e.which == 13 ? onMentorAddClick() : true;
  });
  $('.mentors').on('click', '.mentors__show-wishlist-button', onShowWishListClick);

  $('.wishlist').on('mouseenter', '.wishlist__priority i', onHoverRating);
  $('.wishlist').on('click', '.wishlist__priority i', onRatingClick);
  $('.wishlist').on('mouseleave', '.wishlist__priority', onLeavingRating);

  $('.tasks').on('click', '.tasks__task-delete-button', onTaskDeleteClick);
  $('.tasks').on('click', '.tasks__task-item-name', onTaskEditClick);
  $('.tasks').on('click', '.tasks__task-item-details', onTaskDetailEditClick);
  $('.tasks').on('mouseenter', '.tasks__task-item-rating i', onHoverRating);
  $('.tasks').on('click', '.tasks__task-item-rating i', onRatingClick);
  $('.tasks').on('mouseleave', '.tasks__task-item-rating', onLeavingRating);
});

function onDistributionButtonClick() {
  var mentorItem = void 0,
      studentsList = void 0;

  $('.distribution__list').empty();
  Mentors.forEach(function (elem) {
    elem.list.forEach(function (item) {});
  });
}

function onShowWishListClick(event) {
  var studentName = $(this).parent(".students__name").text().trim();
  var mentorName = $(this).parent(".mentors__name").text().trim();
  var studentId = $(this).parent(".students__name").data("id");
  var mentorId = $(this).parent(".mentors__name").data("id");
  var elements = '';

  if (studentName) {
    $('.wishlist__title').text(studentName);
    var student = getObject(Students, studentId);
    student.wishList.forEach(function (elem) {
      elements += '\n        <div class="wishlist__element" data-id="' + elem.mentorId + '">\n          <div class="wishlist__element-name">' + getNameById(elem.mentorId, Mentors) + '</div>\n          <div class="wishlist__priority" data-type="mentor">' + createRatingElem(elem.priority, 10) + '</div>\n        </div>\n      ';
    });
    $('.wishlist__list').empty().append(elements);
    $('.wishlist').css({
      top: event.pageY,
      left: event.pageX - $('.wishlist').width() - 20
    }).fadeIn(50);
  }
  if (mentorName) {
    $('.wishlist__title').text(mentorName);
    var mentor = getObject(Mentors, mentorId);
    mentor.wishList.forEach(function (elem) {
      elements += '\n        <div class="wishlist__element" data-id="' + elem.studentId + '">\n          <div class="wishlist__element-name">' + getNameById(elem.studentId, Students) + '</div>\n          <div class="wishlist__priority" data-type="student">' + createRatingElem(elem.priority, 10) + '</div>\n        </div>\n      ';
    });
    $('.wishlist__list').empty().append(elements);
    $('.wishlist').css({
      top: event.pageY,
      left: event.pageX - $('.wishlist').width() - 20
    }).fadeIn(50);
  }
}

function onHoverRating() {
  $(this).prevAll().andSelf().addClass("fa-star").removeClass("fa-star-o");
  $(this).nextAll().removeClass("fa-star").addClass('fa-star-o');
}

function onLeavingRating() {
  var elemType = $(this).data("type");
  var rating = void 0;

  if (elemType == "task") {
    var taskId = $(this).closest('.tasks__task-item').data("id");
    rating = getTaskRating(taskId);
  } else if (elemType == "student") {
    var mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Mentors);
    var studentId = $(this).parent().data("id");

    rating = getPriorityOfStudent(studentId, mentorId);
  } else if (elemType == "mentor") {
    var _studentId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Students);
    var _mentorId = $(this).parent().data("id");

    rating = getPriorityOfMentor(_mentorId, _studentId);
  }

  if (rating === 0) {
    $(this).children().addClass('fa-star-o').removeClass("fa-star");
  } else {
    $(this).children().each(function (i, elem) {
      if (Number(elem.dataset.value) === rating) {
        $(elem).prevAll().andSelf().addClass('fa-star').removeClass("fa-star-o");
        $(elem).nextAll().addClass('fa-star-o').removeClass("fa-star");
      }
    });
  }
}

function onRatingClick() {
  var value = $(this).data("value");
  var elemType = $(this).parent().data("type");

  if (elemType == 'task') {
    var taskId = $(this).closest('.tasks__task-item').data("id");
    setTaskRating(taskId, value);
  } else if (elemType == 'student') {
    var studentId = $(this).closest('.wishlist__element').data("id");
    var mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Mentors);
    setStudentPriority(studentId, mentorId, value);
  } else if (elemType == 'mentor') {
    var _mentorId2 = $(this).closest('.wishlist__element').data("id");
    var _studentId2 = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Students);
    setMentorPriority(_mentorId2, _studentId2, value);
  }
}

function exportJSON() {

  var result = {
    students: Students,
    groups: Groups,
    mentors: Mentors,
    tasks: Tasks
  };
  var string = JSON.stringify(result);
  $(this).parent().find('textarea').val(string).toggle();
}

function editElement(inputType, elem, obj, elemId, valueKey) {
  var prevName = elem.text();
  elem.hide();
  elem.before(inputType);
  inputType.val(elem.text());
  inputType.focus();

  inputType.blur(function () {
    if (inputType.val() === '') {
      elem.text(prevName);
    } else elem.text(inputType.val());
    changeValueOfObject(valueKey, obj, elemId, elem.text());
    inputType.remove();
    elem.show();
  });
}

function onGroupEditClick() {
  var input = $('<input type="text">');
  var groupName = $(this);
  var groupId = getIdByName(groupName.text(), Groups);

  editElement(input, groupName, Groups, groupId, 'name');
}

function onTaskEditClick() {
  var input = $('<input type="text">');
  var taskName = $(this);
  var taskId = getIdByName(taskName.text(), Tasks);

  editElement(input, taskName, Tasks, taskId, 'name');
}

function onTaskDetailEditClick() {
  var input = $('<textarea class="form-control" rows="6"></textarea>');
  var taskDetails = $(this);
  var taskId = taskDetails.parent().data("id");

  editElement(input, taskDetails, Tasks, taskId, 'details');
}

function onStudentEditClick() {
  var input = $('<input type="text" class="form-control">');
  var studentName = $(this);
  var studentId = studentName.parent().data("id");

  editElement(input, studentName, Students, studentId, 'name');
}

function onMentorEditClick() {
  var input = $('<input type="text" class="form-control">');
  var mentorName = $(this);
  var mentorId = mentorName.parent().data("id");

  editElement(input, mentorName, Mentors, mentorId, 'name');
}

function onTaskAddClick() {
  var studentId = $(this).closest(".students__name").data("id");
  var groupId = $(this).closest(".groups__item").data("id");

  if (studentId) addTask('Индивидуальное задание ' + (Tasks.counter + 1), 'Описание индивидуального задания...', studentId, false);
  if (groupId) addTask('Групповое задание ' + (Tasks.counter + 1), 'Описание группового задания...', groupId, true);

  showTasks();
}

function onTaskDeleteClick() {
  var taskName = $(this).closest('.tasks__task-item').find('.tasks__task-item-name').text().trim();
  var taskId = getIdByName(taskName, Tasks);

  deleteTask(taskId);
  renderList();
}

function onGroupDeleteClick() {
  var groupId = $(this).parents('.groups__item').data("id");

  dismissGroup(groupId);
  deleteGroup(groupId);
  renderList();
}

function onGroupExpellAllClick() {
  var groupId = $(this).parents('.groups__item').data("id");
  dismissGroup(groupId);
  renderList();
}

function onStudentExpelClick() {
  var studentId = $(this).closest(".students__name").data("id");
  var groupId = $(this).closest(".groups__item").data("id");

  expelStudentFromGroup(studentId, groupId);
  renderList();
}

function onAddGroupMenuClick() {
  var groupName = $(this).text();
  var studentId = $(this).closest('.students__name').data("id");

  addStudentToGroup(studentId, getIdByName(groupName, Groups));
  renderList();
}

function onAddGroupBtnClick() {
  var studentId = $(this).closest(".students__name").data("id");
  var groupName = "Группа " + (Groups.counter + 1);

  addGroup(groupName);
  addStudentToGroup(studentId, getIdByName(groupName, Groups));
  renderList();
}

function onStudentAddToGroupClick() {
  var student = $(this).parent();
  var groupsNames = getNamesFrom(Groups);

  var groupsList = '';

  groupsNames.forEach(function (name) {
    groupsList += '\n      <div class="students__group-menu-button label label-default">' + name + '</div>\n    ';
  });

  student.append('\n    <div class="students__group-list">\n      ' + groupsList + '\n      <div class="students__new-group label label-success">Новая группа</div>\n    </div>\n  ');
}

function onStudentAddClick() {
  var name = $('.students__input').val();
  if (name) {
    if (getNamesFrom(Students).indexOf(name) !== -1) {
      $('.students .input-group').addClass("has-error");
      $('.students__input-error').text("Такое имя уже есть");
      return false;
    }
    $('.students .input-group').removeClass("has-error");
    $('.students__input-error').text("");
    addStudent(name);
    renderList();
    $('.students__input').val("");
  } else {
    $('.students__input-error').text("Не введено имя!");
    $('.students .input-group').addClass("has-error");
  }
}

function onMentorAddClick() {
  var name = $('.mentors__input').val();
  if (name) {
    if (getNamesFrom(Mentors).indexOf(name) !== -1) {
      $('.mentors .input-group').addClass("has-error");
      $('.mentors__input-error').text("Такое имя уже есть");
      return false;
    }
    $('.mentors .input-group').removeClass("has-error");
    $('.mentors__input-error').text("");
    addMentor(name);
    renderList();
    $('.mentors__input').val("");
  } else {
    $('.mentors__input-error').text("Не введено имя!");
    $('.mentors .input-group').addClass("has-error");
  }
}

function onStudentDeleteClick() {
  var studentId = $(this).parent().data("id");
  var accept = confirm("Действительно удалить " + getNameById(studentId, Students) + "?\nЭто также удалит все связанные со студентом задания!");
  if (accept) {
    $(this).parent().remove();
    deleteStudent(studentId);
    renderList();
  }
}

function onMentorDeleteClick() {
  var mentorId = $(this).parent().data("id");
  var accept = confirm("Действительно удалить " + getNameById(mentorId, Mentors) + "?");
  if (accept) {
    $(this).parent().remove();
    deleteMentor(mentorId);
    renderList();
  }
}

function createGroupElem(groupName) {
  var list = $('.groups__list');
  var group = document.createElement("div");

  var studentsInGroup = '';

  getObject(Groups, getIdByName(groupName, Groups)).studentsId.forEach(function (elem) {
    //По имени группы получаем ее id. Далее перебираем все id студентов из массива studentsId.
    var student = getObject(Students, elem); //Формируем для каждого свой элемент и добавляем в переменную.
    studentsInGroup += '\n    <div class="students__name" data-id="' + student.id + '">\n      <span>' + student.name + '</span>\n      <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>\n      <div class="students__button students__expel-button" title="Исключить из группы"><i class="fa fa-user-times"></i></div>\n      <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>\n    </div>\n    ';
  });
  if (!studentsInGroup.length) studentsInGroup = "<div class='students__no-items'>В группе нет студентов<div>"; //Если в группе нет студентов то выкатываем элемент заглушку.
  group.innerHTML = //Формируем общий вид группы и добавляем в нее все элементы студентов, если есть.
  '\n    <h5 class="groups__item-name">\n      <span>' + groupName + '</span>\n      <div class="students__button students__delete-group-button" title="Удалить группу"><i class="fa fa-trash"></i></div>\n      <div class="students__button students__expel-all-button" title="Исключить всех"><i class="fa fa-times"></i></div>\n      <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>\n    </h5>\n    ' + studentsInGroup + '\n  ';
  group.className = "groups__item";
  group.dataset.id = getIdByName(groupName, Groups);

  list.append(group);
}

function createTaskElem(taskName, taskDetails, taskAuthor, isGroupTask, taskRating) {
  var list = $('.tasks__list');
  var task = document.createElement('div');
  var author = void 0;

  if (isGroupTask) author = getNameById(taskAuthor, Groups);else author = getNameById(taskAuthor, Students);
  task.innerHTML = '\n    <h5 class="tasks__task-item-name">' + taskName + '</h5>\n    <div class="tasks__task-item-details">' + taskDetails + '</div>\n    <div class="tasks__task-item-author">Исполнитель: <span>' + author + '</span></div>\n    <div class="tasks__task-item-rating" data-type="task">\n      ' + createRatingElem(taskRating, 5) + '\n    </div>\n    <div class="tasks__task-delete-button"><i class="fa fa-times"></i></div>\n  ';
  task.className = 'tasks__task-item';
  task.dataset.id = getIdByName(taskName, Tasks);

  list.append(task);
}

function createRatingElem(taskRating, length) {
  var rating = '';

  for (var i = 1; i < length + 1; i++) {
    if (i <= taskRating) rating += '<i class="fa fa-star" data-value="' + i + '"></i>';else rating += '<i class="fa fa-star-o" data-value="' + i + '"></i>';
  }
  return rating;
}

function createStudentElem(studentName) {
  var list = $(".students__list");
  var student = document.createElement("div");

  student.innerHTML = '\n    <span>' + studentName + '</span>\n    <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>\n    <div class="students__button students__add-to-group-button" title="Добавить в группу..."><i class="fa fa-plus"></i></div>\n    <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>\n    <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>\n  ';
  student.className = 'students__name';
  student.dataset.id = getIdByName(studentName, Students);

  list.append(student);
}

function createMentorElem(mentorName) {
  var list = $(".mentors__list");
  var mentor = document.createElement("div");

  mentor.innerHTML = '\n    <span>' + mentorName + '</span>\n    <div class="mentors__button mentors__delete-button" title="Удалить ментора"><i class="fa fa-trash"></i></div>\n    <div class="mentors__button mentors__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>\n  ';
  mentor.className = 'mentors__name';
  mentor.dataset.id = getIdByName(mentorName, Mentors);

  list.append(mentor);
}

function showStudents() {
  Students.forEach(function (elem) {
    if (elem.name && !elem.groupId) createStudentElem(elem.name);
  });
}
function showMentors() {
  Mentors.forEach(function (elem) {
    if (elem.name) createMentorElem(elem.name);
  });
}

function showGroups() {
  Groups.forEach(function (elem) {
    if (elem.name) createGroupElem(elem.name);
  });
}

function showTasks() {
  $('.tasks__list').empty();
  if (!Tasks.length) {
    $('.tasks__list').append('<div class="tasks__no-items">Задания пока не назначены</div>');
    return false;
  }
  Tasks.forEach(function (elem) {
    if (elem.name) {
      var authorId = void 0,
          isGroupTask = void 0;
      if (elem.groupId) {
        authorId = elem.groupId;
        isGroupTask = true;
      } else authorId = elem.studentId;
      createTaskElem(elem.name, elem.details, authorId, isGroupTask, elem.rating);
    }
  });
}

function renderList() {
  $('.students__list').empty().append('<div class="groups__list"></div>');
  $('.mentors__list').empty();
  showGroups();
  if (!Students.length) $('.students__list').append('\n    <div class="students__no-items">\n      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>\n      <p style="font-size: 14px;">Как ни крути, а без студентов ничего не выйдет. Добавьте парочку...</p>\n    </div>\n  ');
  showStudents();
  showTasks();
  if (!Mentors.length) $('.mentors__list').append('\n    <div class="mentors__no-items">\n      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>\n      <p style="font-size: 14px;">Как ни крути, а без менторов ничего не выйдет. Добавьте парочку...</p>\n    </div>\n  ');
  showMentors();
}

function getObject(object, elemId) {
  return object.filter(function (elem) {
    return elem.id === Number(elemId);
  })[0];
}

function getNamesFrom(object) {
  return object.reduce(function (sum, item) {
    return sum.concat(item.name);
  }, []);
}

function getIdByName(name, object) {
  return object.filter(function (elem) {
    return elem.name === name;
  })[0].id;
}

function getNameById(id, object) {
  return object.filter(function (elem) {
    return elem.id === Number(id);
  })[0].name;
}

function addMentor(mentorName) {
  Mentors.push({ // создаем новый объект ментора и присваиваем имя и id
    id: Mentors.counter + 1,
    name: mentorName,
    list: [],
    wishList: []
  });

  Students.forEach(function (elem) {
    // для каждого существующего студента
    if (elem.name) {
      elem.wishList.push({ // заносим параметры ментора в wishlist каждого студента
        mentorId: Mentors.counter + 1,
        priority: 0
      });
      getObject(Mentors, Mentors.counter + 1).wishList.push({ // заносим параметры каждого существующего студента в wishlist вновьсозданного ментора
        studentId: elem.id,
        priority: 0,
        synergy: 0
      });
    }
  });
  Mentors.counter++;
}

function deleteMentor(mentorId) {
  Mentors.forEach(function (elem, i) {
    if (elem.id === Number(mentorId)) Mentors.splice(i, 1);
  });
  Students.forEach(function (elem) {
    elem.wishList.forEach(function (item, i) {
      if (item.mentorId === mentorId) elem.wishList.splice(i, 1);
    });
  });
}

function addStudent(studentName) {
  Students.push({
    id: Students.counter + 1,
    name: studentName,
    groupId: 0,
    tasksId: [],
    wishList: []
  });
  Mentors.forEach(function (elem) {
    if (elem.name) {
      elem.wishList.push({
        studentId: Students.counter + 1,
        priority: 0,
        synergy: 0
      });
      Students[Students.counter + 1]["wishList"].push({
        mentorId: elem.id,
        priority: 0
      });
    }
  });
  Students.counter++;
}

function deleteStudent(studentId) {
  Students.forEach(function (elem, i) {
    if (elem.id === Number(studentId)) {
      var studentsTasks = elem.tasksId;
      studentsTasks.forEach(function (item) {
        return deleteTask(item);
      });
      Students.splice(i, 1);
    }
  });
  Groups.forEach(function (elem) {
    var id = elem.studentsId.indexOf(studentId);
    if (id !== -1) elem.studentsId.splice(id, 1);
  });
  Mentors.forEach(function (elem) {
    elem.wishList.forEach(function (item, i) {
      if (item.studentId === studentId) elem.wishList.splice(i, 1);
    });
  });
}

function addGroup(groupName) {
  Groups.push({
    id: Groups.counter + 1,
    name: groupName,
    studentsId: [],
    tasksId: []
  });
  Groups.counter++;
}

function deleteGroup(groupId) {
  Groups.forEach(function (elem, i) {
    if (elem.id === Number(groupId)) {
      var groupTasks = elem.tasksId;
      groupTasks.forEach(function (item) {
        return deleteTask(item);
      });
      Groups.splice(i, 1);
    }
  });
}

function dismissGroup(groupId) {
  var group = getObject(Groups, groupId);
  group.studentsId.forEach(function (id) {
    getObject(Students, id).groupId = 0;
  });
  group.studentsId = [];
}

function addStudentToGroup(studentId, groupId) {
  var group = getObject(Groups, groupId);
  var student = getObject(Students, studentId);
  group.studentsId.push(studentId);
  student.groupId = groupId;
}

function expelStudentFromGroup(studentId, groupId) {
  var group = getObject(Groups, groupId);
  var student = getObject(Students, studentId);
  group.studentsId = group.studentsId.filter(function (elem) {
    return elem !== studentId;
  });
  student.groupId = 0;
}

function addTask(taskName, details, authorId, isGroup) {
  Tasks.push({
    id: Tasks.counter + 1,
    name: taskName,
    details: details,
    rating: 0,
    studentId: 0,
    groupId: 0
  });
  var currentTask = getObject(Tasks, Tasks.counter + 1);
  if (isGroup) {
    currentTask.groupId = authorId;
    getObject(Groups, authorId).tasksId.push(currentTask.id);
  } else {
    currentTask.studentId = authorId;
    getObject(Students, authorId).tasksId.push(currentTask.id);
  }
  Tasks.counter++;
}

function deleteTask(taskId) {
  Tasks.forEach(function (elem, i) {
    if (elem.id === Number(taskId)) Tasks.splice(i, 1);
  });
}

function getTaskRating(taskId) {
  return Tasks.filter(function (elem) {
    return elem.id === Number(taskId);
  })[0].rating;
}

function setTaskRating(taskId, newRating) {
  getObject(Tasks, taskId).rating = newRating;
}

function changeValueOfObject(valueKey, obj, elemId, newValue) {
  getObject(obj, elemId)[valueKey] = newValue;
}

// function setWishlists() {
//   for (let elem in Students) {
//     for (let item in Mentors) {
//       if (Students[elem].name && Mentors[item].name) {
//         const wishList = Students[elem].wishList;
//         if (!wishList.length) wishList.push({mentorId: Mentors[item].id, priority: 0});
//         else {
//           let isIdInWishlist;
//           for (let id in wishList) {
//             if (wishList[id].mentorId === Mentors[item].id) isIdInWishlist = true;
//           }
//           if (!isIdInWishlist) wishList.push({mentorId: Mentors[item].id, priority: 0});
//         }
//       }
//     }
//   }
//   for (let elem in Mentors) {
//     for (let item in Students) {
//       if (Mentors[elem].name && Students[item].name) {
//         const wishList = Mentors[elem].wishList;
//         if (!wishList.length) wishList.push({studentId: Students[item].id, priority: 0, synergy: 0});
//         else {
//           let isIdInWishlist;
//           for (let id in wishList) {
//             if (wishList[id].studentId === Students[item].id) isIdInWishlist = true;
//           }
//           if (!isIdInWishlist) wishList.push({studentId: Students[item].id, priority: 0, synergy: 0});
//         }
//       }
//     }
//   }
// }

function getWishlistOf(obj, elemId) {
  return getObject(obj, elemId).wishList;
}

function getPriorityOfMentor(mentorId, studentId) {
  var wishList = getWishlistOf(Students, studentId);
  return wishList.filter(function (elem) {
    return elem.mentorId === Number(mentorId);
  })[0].priority;
}

function setMentorPriority(mentorId, studentId, value) {
  var wishList = getObject(Students, studentId).wishList;
  wishList.forEach(function (elem) {
    if (elem.mentorId === Number(mentorId)) elem.priority = value;
  });
}

function getPriorityOfStudent(studentId, mentorId) {
  var wishList = getObject(Mentors, mentorId).wishList;
  return wishList.filter(function (elem) {
    return elem.studentId === Number(studentId);
  })[0].priority;
}

function setStudentPriority(studentId, mentorId, value) {
  var wishList = getObject(Mentors, mentorId).wishList;
  wishList.forEach(function (elem) {
    if (elem.studentId === Number(studentId)) elem.priority = value;
  });
}

// function collectSynergy() {                   // Функция вычисляет значение синергии студента и ментора и записывает значение в объект ментора
//   for (let elem in Mentors) {                 // Для каждого ментора
//     if (Mentors[elem].name) {                 // проверяем существует ли элемент
//       const wishList = getWishlistOf(Mentors,Mentors[elem].id);   // и заносим список приоритетов в константу
//       for (let item in wishList) {            // Далее для каждого элемента списка приоритетов
//         wishList[item].synergy = wishList[item].priority + getPriorityOfMentor(Mentors[elem].id,wishList[item].studentId); // вычисляем сумму приоритетов ментора и студента и заносим в переменную
//       }
//     }
//   }
// }
function collectSynergy() {
  Mentors.forEach(function (elem) {
    if (elem.id) {
      var wishList = getWishlistOf(Mentors, elem.id);
      wishList.forEach(function (item) {
        item.synergy = item.priority + getPriorityOfMentor(elem.id, item.studentId);
      });
    }
  });
}

// function setRandPriority() {
//   for (let n in Mentors) {
//     if (Mentors[n].name) {
//       Mentors[n].wishList = [];
//       for (let k in Students) {
//         if (Students[k].name) {
//           Mentors[n].wishList.push({studentId:Students[k].id,priority: Math.floor(Math.random() * 10) + 1});
//         }
//       }
//     }
//   }
//   for (let n in Students) {
//     if (Students[n].name) {
//       Students[n].wishList = [];
//       for (let k in Mentors) {
//         if (Mentors[k].name) {
//           Students[n].wishList.push({mentorId:Mentors[k].id,priority: Math.floor(Math.random() * 10) + 1});
//         }
//       }
//     }
//   }
// }

function getMentorPopularity(mentorId) {
  // POPULARITY
  var mentorPopularity = [];
  var wishList = void 0;
  for (var elem in Students) {
    if (Students[elem].id) wishList = getWishlistOf(Students, Students[elem].id);
    for (var item in wishList) {
      if (wishList[item].mentorId === mentorId) mentorPopularity.push(wishList[item].priority);
    }
  }
  mentorPopularity = mentorPopularity.reduce(function (sum, item) {
    return sum + item;
  });
  return mentorPopularity;
}

function sortStudents() {
  var array = [];

  for (var elem in Mentors) {
    if (Mentors[elem].wishList) {
      var wish = Mentors[elem].wishList;
      for (var id in wish) {
        array.push([wish[id].synergy, Mentors[elem].id, wish[id].studentId]);
      }
    }
  }

  array.sort(function (a, b) {
    if (a[0] === b[0]) return b[1] - a[1];
    return b[0] - a[0];
  });
  // console.log(array);

  var maxStudentsAtMentor = Math.floor(Students.length / Mentors.length);
  if (Students.length % Mentors.length !== 0) maxStudentsAtMentor++;

  var sortedStudents = 0;

  var _loop = function _loop() {
    var nextStudent = array.shift();
    if (nextStudent) {
      getObject(Mentors, nextStudent[1]).list.push(nextStudent[2]);
      array = array.filter(function (n) {
        if (!(n[2] === nextStudent[2] || getObject(Mentors, n[1]).list.length >= maxStudentsAtMentor)) return n;
      });
      sortedStudents++;
    } else return 'break';
  };

  while (sortedStudents < Students.length) {
    var _ret = _loop();

    if (_ret === 'break') break;
  }
}

// setRandPriority();
// collectSynergy();