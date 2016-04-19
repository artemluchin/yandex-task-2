function onDistributionButtonClick() {
  let distributionList = '';
  $('.distribution__list').empty();
  
  collectSynergy();
  sortStudents();
  
  mentors.forEach(elem => {
    let studentsList = ``;
    let mentorItem = ``;
    elem.list.forEach(id => {
      studentsList += `<li class="distribution__item-list-element">${getNameById(id,students)}</li>`;
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
    const student = getElemOfObject(students, studentId);
    student.wishList.forEach(elem => {
      elements += `
        <div class="wishlist__element" data-id="${elem.mentorId}">
          <div class="wishlist__element-name">${getNameById(elem.mentorId, mentors)}</div>
          <div class="wishlist__priority" data-type="mentor">${createRatingElem(elem.priority, 10)}</div>
        </div>
      `;
    });
    $('.wishlist__list').empty().append(elements);
    $('.wishlist').css({
      top: event.pageY,
      left: event.pageX-$('.wishlist').width()-20
    }).fadeIn(50);
  }
  if (mentorName) {
    $('.wishlist__title').text(mentorName);
    const mentor = getElemOfObject(mentors, mentorId);
    mentor.wishList.forEach(elem => {
      elements += `
        <div class="wishlist__element" data-id="${elem.studentId}">
          <div class="wishlist__element-name">${getNameById(elem.studentId, students)}</div>
          <div class="wishlist__priority" data-type="student">${createRatingElem(elem.priority, 10)}</div>
        </div>
      `;
    });
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
    const mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), mentors);
    const studentId = $(this).parent().data("id");
    
    rating = getPriorityOfStudent(studentId, mentorId);
  }
  else if (elemType == "mentor") {
    const studentId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), students);
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
    });
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
    const mentorId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), mentors);
    setStudentPriority(studentId, mentorId, value);
  }
  else if (elemType == 'mentor') {
    const mentorId = $(this).closest('.wishlist__element').data("id");
    const studentId = getIdByName($(this).closest('.wishlist').find('.wishlist__title').text().trim(), students);
    setMentorPriority(mentorId, studentId, value);
  }
}


function onClearAllClick() {
  clearAll();
  renderApp();
}


function onMouseDown(event) {
  const groupList = $('.students__group-list');
  const wishlist = $('.wishlist');
  const distribution = $('.distribution');
  const objects = [].concat(groupList,wishlist,distribution);
  
  objects.forEach(elem => {
    if (!elem.is(event.target) && elem.has(event.target).length == 0) elem.fadeOut(200);
  });
}


function onMentorTitleClick() {
  $('.mentors__title').addClass('mentors__title_active');
  $('.mentors').show();
  $('.students__title').removeClass('students__title_active');
  $('.students').hide();
}


function onStudentTitleClick() {
  $('.students__title').addClass('students__title_active');
  $('.students').show();
  $('.mentors__title').removeClass('mentors__title_active');
  $('.mentors').hide();
}

function onGroupEditClick() {
  const input = $('<input type="text">');
  const groupName = $(this);
  const groupId = getIdByName(groupName.text(), groups);

  editElement(input,groupName,groups,groupId,'name');
}

function onTaskEditClick() {
  const input = $('<input type="text">');
  const taskName = $(this);
  const taskId = getIdByName(taskName.text(), tasks);
  
  editElement(input,taskName,tasks,taskId,'name');
}

function onTaskDetailEditClick() {
  const input = $('<textarea class="form-control" rows="6"></textarea>');
  const taskDetails = $(this);
  const taskId = taskDetails.parent().data("id");
  
  editElement(input,taskDetails,tasks,taskId,'details');
}

function onStudentEditClick() {
  const input = $('<input type="text" class="form-control">');
  const studentName = $(this);
  const studentId = studentName.parent().data("id");
  
  editElement(input,studentName,students,studentId,'name');
}

function onMentorEditClick() {
  const input = $('<input type="text" class="form-control">');
  const mentorName = $(this);
  const mentorId = mentorName.parent().data("id");
  
  editElement(input,mentorName,mentors,mentorId,'name');
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


function onTaskAddClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupId = $(this).closest(".groups__item").data("id");
  
  if (studentId) addTask('Индивидуальное задание '+(tasks.counter+1), 'Описание индивидуального задания...', studentId, false);
  if (groupId) addTask('Групповое задание '+(tasks.counter+1), 'Описание группового задания...', groupId, true);
  
  showTasks();
}


function onTaskDeleteClick() {
  const taskName = $(this).closest('.tasks__task-item').find('.tasks__task-item-name').text().trim();
  const taskId = getIdByName(taskName, tasks);
  
  deleteTask(taskId);
  renderApp();
}

function onGroupDeleteClick() {
  const groupId = $(this).parents('.groups__item').data("id");
  
  dismissGroup(groupId);
  deleteGroup(groupId);
  renderApp();
}


function onGroupExpellAllClick() {
  const groupId = $(this).parents('.groups__item').data("id");
  dismissGroup(groupId);
  renderApp();
}


function onStudentExpelClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupId = $(this).closest(".groups__item").data("id");
  
  expelStudentFromGroup(studentId,groupId);
  renderApp();
}

function onAddGroupMenuClick() {
  const groupName = $(this).text();
  const studentId = $(this).closest('.students__name').data("id");
  
  addStudentToGroup(studentId,getIdByName(groupName,groups));
  renderApp();
}

function onAddGroupBtnClick() {
  const studentId = $(this).closest(".students__name").data("id");
  const groupName = "Группа "+(groups.counter+1);
  
  addGroup(groupName);
  addStudentToGroup(studentId,getIdByName(groupName,groups));
  renderApp();
}

function onStudentAddToGroupClick() {
  const student = $(this).parent();
  const groupsNames = getNamesFrom(groups);
  
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
    if (getNamesFrom(students).indexOf(name) !== -1) {
      $('.students .input-group').addClass("has-error");
      $('.students__input-error').text("Такое имя уже есть");
      return false;
    }
    $('.students .input-group').removeClass("has-error");
    $('.students__input-error').text("");
    addStudent(name);
    renderApp();
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
    if (getNamesFrom(mentors).indexOf(name) !== -1) {
      $('.mentors .input-group').addClass("has-error");
      $('.mentors__input-error').text("Такое имя уже есть");
      return false;
    }
    $('.mentors .input-group').removeClass("has-error");
    $('.mentors__input-error').text("");
    addMentor(name);
    renderApp();
    $('.mentors__input').val("");
  }
  else {
    $('.mentors__input-error').text("Не введено имя!");
    $('.mentors .input-group').addClass("has-error");
  }
}


function onStudentDeleteClick() {
  const studentId = $(this).parent().data("id");
  let accept = confirm("Действительно удалить "+getNameById(studentId,students)+"?\nЭто также удалит все связанные со студентом задания!");
  if (accept) {
    $(this).parent().remove();
    deleteStudent(studentId);
    renderApp(); 
  }
}


function onMentorDeleteClick() {
  const mentorId = $(this).parent().data("id");
  let accept = confirm("Действительно удалить "+getNameById(mentorId,mentors)+"?");
  if (accept) {
    $(this).parent().remove();
    deleteMentor(mentorId);
    renderApp(); 
  }
}

function exportJSON() {
  
  const result = {
    students: students,
    groups: groups,
    mentors: mentors,
    tasks: tasks
  };
  const string = JSON.stringify(result);
  $(this).parent().find('textarea').val(string).toggle();
}