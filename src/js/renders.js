function renderApp() {
  showStudents();
  showGroups();
  showTasks();
  showMentors();
}


function showStudents() {
  $('.students__list').empty().append('<div class="groups__list"></div>');
  
  if (!students.length) $('.students__list').append(`
    <div class="students__no-items">
      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>
      <p style="font-size: 14px;">Как ни крути, а без студентов ничего не выйдет. Добавьте парочку...</p>
    </div>
  `);
  else {
    students.forEach(elem => {
    if (elem.name && !elem.groupId) createStudentElem(elem.name);
  });
  }
}


function showGroups() {
    groups.forEach(elem => {
    if (elem.name) createGroupElem(elem.name);
  });
}


function showMentors() {
  $('.mentors__list').empty();
  if (!mentors.length) $('.mentors__list').append(`
    <div class="mentors__no-items">
      <div><i class="fa fa-4x fa-arrow-circle-up"></i></div>
      <p style="font-size: 14px;">Как ни крути, а без менторов ничего не выйдет. Добавьте парочку...</p>
    </div>
  `);
  else {
    mentors.forEach(elem => {
    if (elem.name) createMentorElem(elem.name);
  });
  }
}



function showTasks() {
  $('.tasks__list').empty();
  if (!tasks.length) {
    $('.tasks__list').append('<div class="tasks__no-items">Задания пока не назначены</div>');
    return false;
  }
  tasks.forEach(elem => {
    if (elem.name) {
      let authorId, isGroupTask;
      if (elem.groupId) {
        authorId = elem.groupId;
        isGroupTask = true;
      }
      else authorId = elem.studentId;
      createTaskElem(elem.name, elem.details, authorId, isGroupTask, elem.rating);
    }
  });
}


function createGroupElem(groupName) { 
  let studentsInGroup = ``;
  
  getElemOfObject(groups,getIdByName(groupName,groups)).studentsId.forEach(elem => {
    
    let student = getElemOfObject(students,elem);
    
    studentsInGroup += `
      <div class="students__name" data-id="${student.id}">
        <span>${student.name}</span>
        <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>
        <div class="students__button students__expel-button" title="Исключить из группы"><i class="fa fa-user-times"></i></div>
        <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
      </div>
      `;
  });
  if (!studentsInGroup.length) studentsInGroup = "<div class='students__no-items'>В группе нет студентов<div>";

  $('.groups__list').append(`
    <div data-id='${getIdByName(groupName,groups)}' class='groups__item'>
      <h5 class="groups__item-name">
        <span>${groupName}</span>
        <div class="students__button students__delete-group-button" title="Удалить группу"><i class="fa fa-trash"></i></div>
        <div class="students__button students__expel-all-button" title="Исключить всех"><i class="fa fa-times"></i></div>
        <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>
      </h5>
      ${studentsInGroup}
    </div>
  `);
}


function createTaskElem(taskName,taskDetails,taskAuthor,isGroupTask,taskRating) { 
  let author;
  
  if (isGroupTask) author = getNameById(taskAuthor,groups);
  else author = getNameById(taskAuthor,students);
  
  $('.tasks__list').append(`
    <div data-id='${getIdByName(taskName, tasks)}' class='tasks__task-item'>
      <div class="tasks__task-item-name"><span>${taskName}</span></div>
      <div class="tasks__task-item-details"><span>${taskDetails}</span></div>
      <div class="tasks__task-item-author">Автор: <span>${author}</span></div>
      <div class="tasks__task-item-rating" data-type="task">
        ${createRatingElem(taskRating, 5)}
      </div>
      <div class="tasks__task-delete-button"><i class="fa fa-times"></i></div>
    <div>
  `);
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
  $('.students__list').append(`
    <div data-id='${getIdByName(studentName, students)}' class='students__name'>
      <span>${studentName}</span>
      <div class="students__button students__delete-button" title="Удалить студента"><i class="fa fa-trash"></i></div>
      <div class="students__button students__add-to-group-button" title="Добавить в группу..."><i class="fa fa-plus"></i></div>
      <div class="students__button students__add-task-button" title="Создать задачу"><i class="fa fa-file"></i></div>
      <div class="students__button students__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
    </div>
  `);
}


function createMentorElem(mentorName) { 
  $('.mentors__list').append(`
    <div data-id='${getIdByName(mentorName, mentors)}' class='mentors__name'>
      <span>${mentorName}</span>
      <div class="mentors__button mentors__delete-button" title="Удалить ментора"><i class="fa fa-trash"></i></div>
      <div class="mentors__button mentors__show-wishlist-button" title="Открыть список приоритетов"><i class="fa fa-list"></i></div>
    </div>
  `)
}