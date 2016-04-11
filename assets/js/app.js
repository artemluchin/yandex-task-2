$(document).ready(() => {
  
  renderList();
  $('.options__json-export').click(exportJSON);
  $('.options__set-random').click(setRandPriority);
  $('.options__clear-all').click(onClearAllClick);
  $(document).mousedown((e) => {
    const groupList = $('.students__group-list');
    const wishlist = $('.wishlist');
    const distribution = $('.distribution');
    const objects = [].concat(groupList,wishlist,distribution);
    
    objects.forEach(elem => {
      if (!elem.is(e.target) && elem.has(e.target).length == 0) elem.fadeOut(200);
    })
  });
  $('.distribution__button').click(onDistributionButtonClick);
  $(document).on('click','.students__title', () => {
    $('.students__title').addClass('students__title_active');
    $('.students').show();
    $('.mentors__title').removeClass('mentors__title_active');
    $('.mentors').hide();
  });
  $(document).on('click','.mentors__title', () => {
    $('.mentors__title').addClass('mentors__title_active');
    $('.mentors').show();
    $('.students__title').removeClass('students__title_active');
    $('.students').hide();
  });
  
  $('.students').on('click','.students__delete-button', onStudentDeleteClick);
  $('.students').on('click','.students__add-to-group-button', onStudentAddToGroupClick);
  $('.students').on('click','.students__expel-button', onStudentExpelClick);
  $('.students').on('click','.students__group-menu-button', onAddGroupMenuClick);
  $('.students').on('click','.students__new-group', onAddGroupBtnClick);
  $('.students').on('click','.students__add-button', onStudentAddClick);
  $('.students').on('click','.students__add-task-button', onTaskAddClick);
  $('.students').on('click','.students__delete-group-button', onGroupDeleteClick);
  $('.students').on('click','.students__expel-all-button', onGroupExpellAllClick);
  $('.students').on('click','.groups__item-name span', onGroupEditClick);
  $('.students').on('click','.students__name span', onStudentEditClick);
  $('.students__input').keypress(e => (e.which == 13) ? onStudentAddClick() : true);
  $('.students').on('click','.students__show-wishlist-button',onShowWishListClick);
  
  $('.mentors').on('click','.mentors__add-button', onMentorAddClick);
  $('.mentors').on('click','.mentors__name span', onMentorEditClick);
  $('.mentors').on('click','.mentors__delete-button', onMentorDeleteClick);
  $('.mentors__input').keypress(e => (e.which == 13) ? onMentorAddClick() : true);
  $('.mentors').on('click','.mentors__show-wishlist-button',onShowWishListClick);
  
  $('.wishlist').on('mouseenter','.wishlist__priority i',onHoverRating);
  $('.wishlist').on('click','.wishlist__priority i',onRatingClick);
  $('.wishlist').on('mouseleave','.wishlist__priority',onLeavingRating);
  
  $('.tasks').on('click','.tasks__task-delete-button', onTaskDeleteClick);
  $('.tasks').on('click','.tasks__task-item-name', onTaskEditClick);
  $('.tasks').on('click','.tasks__task-item-details', onTaskDetailEditClick);
  $('.tasks').on('mouseenter','.tasks__task-item-rating i',onHoverRating);
  $('.tasks').on('click','.tasks__task-item-rating i',onRatingClick);
  $('.tasks').on('mouseleave','.tasks__task-item-rating',onLeavingRating);
});


function onDistributionButtonClick() {
  let distributionList = '';
  $('.distribution__list').empty();
  
  collectSynergy();
  sortStudents();
  
  Mentors.forEach(elem => {
    let studentsList = ``;
    let mentorItem = ``;
    elem.list.forEach(id => {
      studentsList += `<li class="distribution__item-list-element">${getNameById(id,Students)}</li>`;
    });
    mentorItem += `
    <div class="distribution__item">
        <div class="distribution__item-title">${elem.name}</div>
        <div class="distribution__item-list">
            <ul>${studentsList}</ul>
        </div>
    </div>
    `;
    distributionList += mentorItem;
  });
  
  $('.distribution__list').append(distributionList);
  $('.distribution').show();
}


function onShowWishListClick(event) {
  const studentName = $(this).parent(".students__name").text().trim();
  const mentorName = $(this).parent(".mentors__name").text().trim();
  const studentId = $(this).parent(".students__name").data("id");
  const mentorId = $(this).parent(".mentors__name").data("id");
  let elements = ``;
  
  if (studentName) {
    $('.wishlist__title').text(studentName);
    const student = getObject(Students, studentId);
    student.wishList.forEach(elem => {
      elements += `
        <div class="wishlist__element" data-id="${elem.mentorId}">
          <div class="wishlist__element-name">${getNameById(elem.mentorId, Mentors)}</div>
          <div class="wishlist__priority" data-type="mentor">${createRatingElem(elem.priority, 10)}</div>
        </div>
      `;
    })
    $('.wishlist__list').empty().append(elements);
    $('.wishlist').css({
      top: event.pageY,
      left: event.pageX-$('.wishlist').width()-20
    }).fadeIn(50);
  }
  if (mentorName) {
    $('.wishlist__title').text(mentorName);
    const mentor = getObject(Mentors, mentorId);
    mentor.wishList.forEach(elem => {
      elements += `
        <div class="wishlist__element" data-id="${elem.studentId}">
          <div class="wishlist__element-name">${getNameById(elem.studentId, Students)}</div>
          <div class="wishlist__priority" data-type="student">${createRatingElem(elem.priority, 10)}</div>
        </div>
      `;
    })
    $('.wishlist__list').empty().append(elements);
    $('.wishlist').css({
      top: event.pageY,
      left: event.pageX-$('.wishlist').width()-20
    }).fadeIn(50);
  }
  
}


function onHoverRating() {
  $(this).prevAll().andSelf().addClass("fa-star").removeClass("fa-star-o");
  $(this).nextAll().removeClass("fa-star").addClass('fa-star-o')
}


function onLeavingRating() {
  const elemType = $(this).data("type");
  let rating;
  
  if (elemType == "task") {
    const taskId = $(this).closest('.tasks__task-item').data("id");
    rating = getTaskRating(taskId);
  }
  else if (elemType == "student") {
    const mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Mentors);
    const studentId = $(this).parent().data("id");
    
    rating = getPriorityOfStudent(studentId, mentorId);
  }
  else if (elemType == "mentor") {
    const studentId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Students);
    const mentorId = $(this).parent().data("id");
    
    rating = getPriorityOfMentor(mentorId, studentId);
  }
  
  if (rating === 0) {
    $(this).children().addClass('fa-star-o').removeClass("fa-star");
  }
  else {
    $(this).children().each((i,elem) => {
      if (Number(elem.dataset.value) === rating) {
        $(elem).prevAll().andSelf().addClass('fa-star').removeClass("fa-star-o");
        $(elem).nextAll().addClass('fa-star-o').removeClass("fa-star");
      }
    })
  }
}

function onRatingClick() {
  const value = $(this).data("value");
  const elemType = $(this).parent().data("type");
  
  if (elemType == 'task') {
    const taskId = $(this).closest('.tasks__task-item').data("id");
    setTaskRating(taskId, value);
  }
  else if (elemType == 'student') {
    const studentId = $(this).closest('.wishlist__element').data("id");
    const mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Mentors);
    setStudentPriority(studentId, mentorId, value);
  }
  else if (elemType == 'mentor') {
    const mentorId = $(this).closest('.wishlist__element').data("id");
    const studentId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), Students);
    setMentorPriority(mentorId, studentId, value);
  }
}


function onClearAllClick() {
  clearAll();
  renderList();
}


function editElement(inputType, elem, obj, elemId, valueKey) {
  const prevName = elem.text();
  elem.hide();
  elem.before(inputType);
  inputType.val(elem.text());
  inputType.focus();
  
  inputType.blur(() => {
    if (inputType.val() === '') {
      elem.text(prevName);
    }
    else elem.text(inputType.val());
    changeValueOfObject(valueKey, obj, elemId, elem.text());
    inputType.remove();
    elem.show();
  });
}

function onGroupEditClick() {
  const input = $('<input type="text">');
  const groupName = $(this);
  const groupId = getIdByName(groupName.text(), Groups);

  editElement(input,groupName,Groups,groupId,'name');
}

function onTaskEditClick() {
  const input = $('<input type="text">');
  const taskName = $(this);
  const taskId = getIdByName(taskName.text(), Tasks);
  
  editElement(input,taskName,Tasks,taskId,'name');
}

function onTaskDetailEditClick() {
  const input = $('<textarea class="form-control" rows="6"></textarea>');
  const taskDetails = $(this);
  const taskId = taskDetails.parent().data("id");
  
  editElement(input,taskDetails,Tasks,taskId,'details');
}

function onStudentEditClick() {
  const input = $('<input type="text" class="form-control">');
  const studentName = $(this);
  const studentId = studentName.parent().data("id");
  
  editElement(input,studentName,Students,studentId,'name');
}

function onMentorEditClick() {
  const input = $('<input type="text" class="form-control">');
  const mentorName = $(this);
  const mentorId = mentorName.parent().data("id");
  
  editElement(input,mentorName,Mentors,mentorId,'name');
}


function onTaskAddClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupId = $(this).closest(".groups__item").data("id");
  
  if (studentId) addTask('Индивидуальное задание '+(Tasks.counter+1), 'Описание индивидуального задания...', studentId, false);
  if (groupId) addTask('Групповое задание '+(Tasks.counter+1), 'Описание группового задания...', groupId, true);
  
  showTasks();
}


function onTaskDeleteClick() {
  const taskName = $(this).closest('.tasks__task-item').find('.tasks__task-item-name').text().trim();
  const taskId = getIdByName(taskName, Tasks);
  
  deleteTask(taskId);
  renderList();
}

function onGroupDeleteClick() {
  const groupId = $(this).parents('.groups__item').data("id");
  
  dismissGroup(groupId);
  deleteGroup(groupId);
  renderList();
}


function onGroupExpellAllClick() {
  const groupId = $(this).parents('.groups__item').data("id");
  dismissGroup(groupId);
  renderList();
}


function onStudentExpelClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupId = $(this).closest(".groups__item").data("id");
  
  expelStudentFromGroup(studentId,groupId);
  renderList();
}

function onAddGroupMenuClick() {
  const groupName = $(this).text();
  const studentId = $(this).closest('.students__name').data("id");
  
  addStudentToGroup(studentId,getIdByName(groupName,Groups));
  renderList();
}

function onAddGroupBtnClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupName = "Группа "+(Groups.counter+1);
  
  addGroup(groupName);
  addStudentToGroup(studentId,getIdByName(groupName,Groups));
  renderList();
}

function onStudentAddToGroupClick() {
  const student = $(this).parent();
  const groupsNames = getNamesFrom(Groups);
  
  let groupsList = ``;
  
  groupsNames.forEach(name => {
    groupsList += `
      <div class="students__group-menu-button label label-default">${name}</div>
    `;
  });
  
  student.append(`
    <div class="students__group-list">
      ${groupsList}
      <div class="students__new-group label label-success">Новая группа</div>
    </div>
  `);
}


function onStudentAddClick() {
  let name = $('.students__input').val();
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
  }
  else {
    $('.students__input-error').text("Не введено имя!");
    $('.students .input-group').addClass("has-error");
  }
}

function onMentorAddClick() {
  let name = $('.mentors__input').val();
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
  }
  else {
    $('.mentors__input-error').text("Не введено имя!");
    $('.mentors .input-group').addClass("has-error");
  }
}


function onStudentDeleteClick() {
  const studentId = $(this).parent().data("id");
  let accept = confirm("Действительно удалить "+getNameById(studentId,Students)+"?\nЭто также удалит все связанные со студентом задания!");
  if (accept) {
    $(this).parent().remove();
    deleteStudent(studentId);
    renderList(); 
  }
}


function onMentorDeleteClick() {
  const mentorId = $(this).parent().data("id");
  let accept = confirm("Действительно удалить "+getNameById(mentorId,Mentors)+"?");
  if (accept) {
    $(this).parent().remove();
    deleteMentor(mentorId);
    renderList(); 
  }
}

function createGroupElem(groupName) { 
  const list = $('.groups__list');
  const group = document.createElement("div");
  
  let studentsInGroup = ``;
  
  getObject(Groups,getIdByName(groupName,Groups)).studentsId.forEach(elem => {  //По имени группы получаем ее id. Далее перебираем все id студентов из массива studentsId.
    let student = getObject(Students,elem);                                     //Формируем для каждого свой элемент и добавляем в переменную.
    studentsInGroup += `
    <div class="students__name" data-id="${student.id}">
      <span>${student.name}</span>
      <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>
      <div class="students__button students__expel-button" title="Исключить из группы"><i class="fa fa-user-times"></i></div>
      <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
    </div>
    `;
  });
  if (!studentsInGroup.length) studentsInGroup = "<div class='students__no-items'>В группе нет студентов<div>"; //Если в группе нет студентов то выкатываем элемент заглушку.
  group.innerHTML =                                                                                             //Формируем общий вид группы и добавляем в нее все элементы студентов, если есть.
  `
    <h5 class="groups__item-name">
      <span>${groupName}</span>
      <div class="students__button students__delete-group-button" title="Удалить группу"><i class="fa fa-trash"></i></div>
      <div class="students__button students__expel-all-button" title="Исключить всех"><i class="fa fa-times"></i></div>
      <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>
    </h5>
    ${studentsInGroup}
  `;
  group.className = "groups__item";
  group.dataset.id = getIdByName(groupName,Groups);
  
  list.append(group);
}


function createTaskElem(taskName,taskDetails,taskAuthor,isGroupTask,taskRating) { 
  const list = $('.tasks__list');
  const task = document.createElement('div');
  let author;
  
  if (isGroupTask) author = getNameById(taskAuthor,Groups);
  else author = getNameById(taskAuthor,Students);
  task.innerHTML = `
    <h5 class="tasks__task-item-name">${taskName}</h5>
    <div class="tasks__task-item-details">${taskDetails}</div>
    <div class="tasks__task-item-author">Исполнитель: <span>${author}</span></div>
    <div class="tasks__task-item-rating" data-type="task">
      ${createRatingElem(taskRating, 5)}
    </div>
    <div class="tasks__task-delete-button"><i class="fa fa-times"></i></div>
  `;
  task.className = 'tasks__task-item';
  task.dataset.id = getIdByName(taskName,Tasks);
  
  list.append(task);
}

function createRatingElem(taskRating, length) {
  let rating = ``;
  
  for (let i = 1; i < length+1; i++) {
    if (i <= taskRating) rating+= `<i class="fa fa-star" data-value="${i}"></i>`;
    else rating+=`<i class="fa fa-star-o" data-value="${i}"></i>`;
  }
  return rating;
}


function createStudentElem(studentName) { 
  const list = $(".students__list");
  const student = document.createElement("div");
  
  student.innerHTML = `
    <span>${studentName}</span>
    <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>
    <div class="students__button students__add-to-group-button" title="Добавить в группу..."><i class="fa fa-plus"></i></div>
    <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>
    <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
  `;
  student.className = 'students__name';
  student.dataset.id = getIdByName(studentName, Students);
  
  list.append(student);
}

function createMentorElem(mentorName) { 
  const list = $(".mentors__list");
  const mentor = document.createElement("div");
  
  mentor.innerHTML = `
    <span>${mentorName}</span>
    <div class="mentors__button mentors__delete-button" title="Удалить ментора"><i class="fa fa-trash"></i></div>
    <div class="mentors__button mentors__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
  `;
  mentor.className = 'mentors__name';
  mentor.dataset.id = getIdByName(mentorName, Mentors);
  
  list.append(mentor);
}


function showStudents() {
  $('.students__list').empty().append('<div class="groups__list"></div>');
  
  if (!Students.length) $('.students__list').append(`
    <div class="students__no-items">
      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>
      <p style="font-size: 14px;">Как ни крути, а без студентов ничего не выйдет. Добавьте парочку...</p>
    </div>
  `);
  else {
    Students.forEach(elem => {
    if (elem.name && !elem.groupId) createStudentElem(elem.name);
  })
  }
}
function showMentors() {
  $('.mentors__list').empty();
  if (!Mentors.length) $('.mentors__list').append(`
    <div class="mentors__no-items">
      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>
      <p style="font-size: 14px;">Как ни крути, а без менторов ничего не выйдет. Добавьте парочку...</p>
    </div>
  `)
  else {
    Mentors.forEach(elem => {
    if (elem.name) createMentorElem(elem.name);
  })
  }
}

function showGroups() {
    Groups.forEach(elem => {
    if (elem.name) createGroupElem(elem.name);
  })
}


function showTasks() {
  $('.tasks__list').empty();
  if (!Tasks.length) {
    $('.tasks__list').append('<div class="tasks__no-items">Задания пока не назначены</div>');
    return false;
  }
  Tasks.forEach(elem => {
    if (elem.name) {
      let authorId, isGroupTask;
      if (elem.groupId) {
        authorId = elem.groupId;
        isGroupTask = true;
      }
      else authorId = elem.studentId;
      createTaskElem(elem.name, elem.details, authorId, isGroupTask, elem.rating);
    }
  })
}


function renderList() {
  showStudents();
  showGroups();
  
  showTasks();
  showMentors();
}
