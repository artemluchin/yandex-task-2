'use strict';

const PATH = "dist/data/data.json";

const data = readFromJson(PATH);

let students  = data.students,
    groups    = data.groups,
    tasks     = data.tasks,
    mentors   = data.mentors;

students.counter  = students.length;
groups.counter    = groups.length;
tasks.counter     = tasks.length;
mentors.counter   = mentors.length;

function readFromJson(filePath) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', filePath, false);
  xhr.send();

  if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
    return false;
  }
  else {
    return JSON.parse(xhr.responseText);
  }
}


/**
 * Возвращет элемент конкретного объекта
 * 
 * @param {object} 
 * @param {number} id
 * @returns {object}
 *
 */
function getElemOfObject(object,elemId) {
  return object.filter(elem => elem.id === Number(elemId))[0];
}


/**
 * Получает все имена элементов в запрашиваемом объекте
 * 
 * @param {object} объект
 * @returns {array} массив имен
 *
 */
function getNamesFrom(object) {
  return object.reduce((sum,item) => sum.concat(item.name),[]);
}


/**
 * Получает id по имени элемента объекта
 * 
 * @param {string} имя студента/группы...
 * @apram {object} объект
 *
 */
function getIdByName(name,object) {
  return object.filter(elem => elem.name === name)[0].id
}


/**
 * Получает имя по id элемента
 * 
 * @param {number} id
 * @param {object}
 * @returns {string} искомое имя
 *
 */
function getNameById(id, object) {
  return object.filter(elem => elem.id === Number(id))[0].name;
}

/**
 * Добавляет ментора в объект mentors, при этом обновляет список
 * приоритетов существующих студентов, а также добавляет в список приоритетов вновьсозданного ментора
 * инфу по всем студентам
 * 
 * @param {string} имя нового ментора
 *
 */
function addMentor(mentorName) {
  mentors.push({ 
    id: mentors.counter+1,
    name: mentorName,
    list: [],
    wishList: []
  });
  
  students.forEach(elem => { 
    if (elem.name) {
      elem.wishList.push({ 
        mentorId: mentors.counter+1,
        priority: 0
      });
      getElemOfObject(mentors,mentors.counter+1).wishList.push({
        studentId: elem.id,
        priority: 0,
        synergy: 0
      })
    }
  });
  mentors.counter++;
}

/**
 * Удаляет объект ментора
 * 
 * @param {number} id ментора
 *
 */
function deleteMentor(mentorId) {
  mentors.forEach((elem,i) => {
    if (elem.id === Number(mentorId)) mentors.splice(i,1);
  });
  students.forEach(elem => {
    elem.wishList.forEach((item,i) => {
      if (item.mentorId === mentorId) elem.wishList.splice(i,1);
    });
  });
}

/**
 * Добавляет студента в объект students, при этом обновляет список
 * приоритетов существующих менторов, а также добавляет в список приоритетов вновьсозданного студента
 * инфу по всем менторам
 * 
 * @param {string} имя нового студента
 *
 */
function addStudent(studentName) {
  students.push({
    id: students.counter + 1,
    name: studentName,
    groupId: 0,
    tasksId: [],
    wishList: []
  });
  mentors.forEach(elem => {
    if (elem.name) {
      elem.wishList.push({
        studentId: students.counter+1,
        priority: 0,
        synergy: 0
      });
      getElemOfObject(students, students.counter+1).wishList.push({
        mentorId: elem.id,
        priority: 0
      });
    }
  });
  students.counter++;
}


/**
 * Удаляет объект студента
 * 
 * @param {number} id студента
 *
 */
function deleteStudent(studentId) {
  students.forEach((elem,i) => {
    if (elem.id === Number(studentId)) {
      const studentsTasks = elem.tasksId;
      studentsTasks.forEach(item => deleteTask(item));
      students.splice(i,1);
    } 
  });
  groups.forEach(elem => {
    let id = elem.studentsId.indexOf(studentId);
    if (id !== -1) elem.studentsId.splice(id,1);
  });
  mentors.forEach(elem => {
    elem.wishList.forEach((item,i) => {
      if (item.studentId === studentId) elem.wishList.splice(i,1);
    })
  });
}


/**
 * Добавляет новую группу
 * 
 * @param{string} имя новой группы
 *
 */
function addGroup(groupName) {
  groups.push({
    id: groups.counter + 1,
    name: groupName,
    studentsId: [],
    tasksId: []
  });
  groups.counter++;
}


/**
 * Удаляет группу
 * 
 * @param {number} id группы
 *
 */
function deleteGroup(groupId) {
  groups.forEach((elem,i) => {
    if (elem.id === Number(groupId)) {
      const groupTasks = elem.tasksId;
      groupTasks.forEach(item => deleteTask(item));
      groups.splice(i,1);
    } 
  });
}


/**
 * Расформировывает группу, удаляя из нее всех студентов, но оставляя саму группу
 * 
 * @param {number} id группы
 *
 */
function dismissGroup(groupId) {
  const group = getElemOfObject(groups,groupId);
  group.studentsId.forEach(id => {
    getElemOfObject(students,id).groupId = 0;
  })
  group.studentsId = [];
}


/**
 * Добавляет студента в группу
 * 
 * @param {number} id студента
 * @param {number} id группы
 *
 */
function addStudentToGroup(studentId,groupId) {
  const group = getElemOfObject(groups,groupId);
  const student = getElemOfObject(students,studentId);
  group.studentsId.push(studentId);
  student.groupId = groupId;
}


/**
 * Исключает студента из группы
 * 
 * @param {number} id студента
 * @param {number} id группы
 *
 */
function expelStudentFromGroup(studentId,groupId) {
  const group = getElemOfObject(groups,groupId);
  const student = getElemOfObject(students,studentId);
  group.studentsId = group.studentsId.filter(elem => elem !== studentId);
  student.groupId = 0;
}


/**
 * Добавляет новую задачу для группы или студента. Также заносит id вновьсозданной задачи
 * в объект студента или группы.id
 * 
 * @param {string} наименование задачи
 * @param {string} описание задачи
 * @param {number} id автора задачи
 * @param {boolean} является ли задача групповой?
 *
 */
function addTask(taskName,details,authorId,isGroup) {
  tasks.push({
    id: tasks.counter + 1,
    name: taskName,
    details: details,
    rating: 0,
    studentId: 0,
    groupId: 0
  });
  const currentTask = getElemOfObject(tasks, tasks.counter+1);
  if (isGroup) {
    currentTask.groupId = authorId;
    getElemOfObject(groups, authorId).tasksId.push(currentTask.id);
  }
  else {
    currentTask.studentId = authorId;
    getElemOfObject(students, authorId).tasksId.push(currentTask.id);
  }
  tasks.counter++;
}


/**
 * Удаляет задачу
 * 
 * @param {number} id задачи
 *
 */
function deleteTask(taskId) {
  tasks.forEach((elem,i) => {
    if (elem.id === Number(taskId)) tasks.splice(i,1);
  });
}


/**
 * Возвращает оценку задачи
 * 
 * @param {number} id задачи
 *
 */
function getTaskRating(taskId) {
  return tasks.filter(elem => elem.id === Number(taskId))[0].rating;
}


/**
 * Устанавливает оценку задаче
 * 
 * @param {number} id задачи
 * @param {number} значение оценки
 *
 */
function setTaskRating(taskId, newRating) {
  getElemOfObject(tasks, taskId).rating = newRating;
}


/**
 * Изменяет заданное значение элемента в заданном объекте.
 * 
 * @param {string} имя параметра объекта
 * @param {object} искомый объект
 * @param {number} id элемента объекта
 * @param {string} новое значение параметра
 *
 */
function changeValueOfObject(valueKey,obj,elemId,newValue) {
  getElemOfObject(obj,elemId)[valueKey] = newValue;
}


/**
 * Получает список приоритетов указанного объекта (студент или ментор)
 *
 * @param {object} искомый объект
 * @param {number} id элемента
 */
function getWishlistOf(obj,elemId) {
  return getElemOfObject(obj,elemId).wishList;
}


/**
 * Получает приоритет конкретного ментора из списка приоритетов указанного студента.
 * 
 * @param {number} id ментора
 * @param {number} id студента
 *
 */
function getPriorityOfMentor(mentorId, studentId) {
  const wishList = getWishlistOf(students,studentId);
  return wishList.filter(elem => elem.mentorId === Number(mentorId))[0].priority;
}


/**
 * Устанавливает значение приоритета для конкретного ментора в списке приоритетов указанного студента.
 * Попроще: студент устанавливает приоритет ментору.
 *
 * @param {number} id ментора
 * @param {number} id студента
 * @param {number} новое значение приоритета
 * 
 */
function setMentorPriority(mentorId, studentId, value) {
  const wishList = getElemOfObject(students, studentId).wishList;
  wishList.forEach(elem => {
    if (elem.mentorId === Number(mentorId)) elem.priority = value;
  });
}


/**
 * Получает приоритет конкретного сутдента из списка приоритетов указанного ментора.
 *
 * @param {number} id студента
 * @param {number} id ментора
 * 
 */
function getPriorityOfStudent(studentId, mentorId) {
  const wishList = getElemOfObject(mentors, mentorId).wishList;
  return wishList.filter(elem => elem.studentId === Number(studentId))[0].priority;
}


/**
 * Устанавливает значение приоритета для конкретного студента в списке приоритетов указанного ментора.
 * Попроще: ментор устанавливает приоритет студенту.
 *
 * @param {number} id студента
 * @param {number} id ментора
 * @param {number} новое значение приоритета
 * 
 */
function setStudentPriority(studentId, mentorId, value) {
  const wishList = getElemOfObject(mentors, mentorId).wishList;
  wishList.forEach(elem => {
    if (elem.studentId === Number(studentId)) elem.priority = value;
  });
}


/**
 * Для каждого ментора вычисляет синергию с конкретным студентом.
 * Синергия = приоритет ментора у студента + приоритет студента у ментора
 * 
 */
function collectSynergy() {
  mentors.forEach(elem => {
    if (elem.id) {
      const wishList = getWishlistOf(mentors, elem.id);
      wishList.forEach(item => {
        item.synergy = item.priority + getPriorityOfMentor(elem.id, item.studentId);
      });
    }
  });
}


/**
 * Устанавливает рандомные приоритеты для всех студентов и менторов.
 * Вспомогательная функция (laziness-mode_on)
 *
 */
function setRandPriority() {
  mentors.forEach(elem => {
    if (elem.name) {
      elem.wishList = [];
      students.forEach(item => {
        if (item.name) elem.wishList.push({studentId:item.id,priority: Math.floor(Math.random() * 10) + 1})
      })
    }
  })
  students.forEach(elem => {
    if (elem.name) {
      elem.wishList = [];
      mentors.forEach(item => {
        if (item.name) elem.wishList.push({mentorId: item.id,priority: Math.floor(Math.random() * 10) + 1})
      })
    }
  })
  alert("Priorities have been set");
}


/**
 * Распределяет студентов среди менторов, согласно спискам приоритетов. Подробнее ход решения описан в теле функции
 *
 */
function sortStudents() {
  mentors.forEach(elem => elem.list = []) // создаем массив(список студентов) для каждого ментора
  let maxStudentsAtMentor = Math.floor(students.length / mentors.length); // вычисляем макс. кол-во студентов для одного ментора
  if (students.length % mentors.length !== 0) maxStudentsAtMentor++; // если не делятся поровну, то увеличиваем макс. кол-во на 1
  
  let array = []; // в данный массив будут заноситься элементы формата -> [синергия студента и ментора, id ментора, id студента]
  
  mentors.forEach(elem => { // формируем массив array, пробегая по каждому студенту в списке приоритетов каждого ментора
    if (elem.wishList) {
      elem.wishList.forEach(item => {
        array.push([item.synergy, elem.id, item.studentId])
      })
    }
  })
  
  array.sort((a,b) => { // сортируем массив по убыванию синергии
    return b[0]-a[0];
  });
  
  while (array.length) { // начинаем процесс распределения пока array не опустошится
    let nextStudent = array.shift();  // берем первый элемент из array
    if (nextStudent) { // если такой есть
      getElemOfObject(mentors,nextStudent[1]).list.push(nextStudent[2]); // добавляем к ментору данного студента
      array = array.filter(n => { // поскольку студент распределен, чистим весь массив от записей с его id
        if (!(n[2] === nextStudent[2] || getElemOfObject(mentors,n[1]).list.length >= maxStudentsAtMentor)) return n; // также чистим array от менторов, если они уже взяли макс. кол-во студентов
      });
    }
  }
}


/**
 * Очищает все объекты.
 *
 */
function clearAll() {
  students = [];
  groups = [];
  tasks = [];
  mentors = [];
  students.counter = groups.counter = tasks.counter = mentors.counter = 0;
}