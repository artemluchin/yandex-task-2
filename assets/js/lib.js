'use strict';

const PATH = "/assets/data/data4.json";

const Data = readFromJson(PATH);

let Students = Data.students;
let Groups = Data.groups;
let Tasks = Data.tasks;
let Mentors = Data.mentors;

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
  }
  else {
    return JSON.parse(xhr.responseText);
  }
}

function exportJSON() {
  
  const result = {
    students: Students,
    groups: Groups,
    mentors: Mentors,
    tasks: Tasks
  };
  const string = JSON.stringify(result);
  $(this).parent().find('textarea').val(string).toggle();
}
















function getObject(object,elemId) {
  return object.filter(elem => elem.id === Number(elemId))[0];
}


function getNamesFrom(object) {
  return object.reduce((sum,item) => sum.concat(item.name),[]);
}


function getIdByName(name,object) {
  return object.filter(elem => elem.name === name)[0].id
}


function getNameById(id, object) {
  return object.filter(elem => elem.id === Number(id))[0].name;
}


function addMentor(mentorName) {
  Mentors.push({ // создаем новый объект ментора и присваиваем имя и id
    id: Mentors.counter+1,
    name: mentorName,
    list: [],
    wishList: []
  });
  
  Students.forEach(elem => { // для каждого существующего студента
    if (elem.name) {
      elem.wishList.push({ // заносим параметры ментора в wishlist каждого студента
        mentorId: Mentors.counter+1,
        priority: 0
      });
      getObject(Mentors,Mentors.counter+1).wishList.push({ // заносим параметры каждого существующего студента в wishlist вновьсозданного ментора
        studentId: elem.id,
        priority: 0,
        synergy: 0
      })
    }
  });
  Mentors.counter++;
}


function deleteMentor(mentorId) {
  Mentors.forEach((elem,i) => {
    if (elem.id === Number(mentorId)) Mentors.splice(i,1);
  });
  Students.forEach(elem => {
    elem.wishList.forEach((item,i) => {
      if (item.mentorId === mentorId) elem.wishList.splice(i,1);
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
  Mentors.forEach(elem => {
    if (elem.name) {
      elem.wishList.push({
        studentId: Students.counter+1,
        priority: 0,
        synergy: 0
      });
      getObject(Students, Students.counter+1).wishList.push({
        mentorId: elem.id,
        priority: 0
      });
    }
  });
  Students.counter++;
}


function deleteStudent(studentId) {
  Students.forEach((elem,i) => {
    if (elem.id === Number(studentId)) {
      const studentsTasks = elem.tasksId;
      studentsTasks.forEach(item => deleteTask(item));
      Students.splice(i,1);
    } 
  });
  Groups.forEach(elem => {
    let id = elem.studentsId.indexOf(studentId);
    if (id !== -1) elem.studentsId.splice(id,1);
  });
  Mentors.forEach(elem => {
    elem.wishList.forEach((item,i) => {
      if (item.studentId === studentId) elem.wishList.splice(i,1);
    })
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
  Groups.forEach((elem,i) => {
    if (elem.id === Number(groupId)) {
      const groupTasks = elem.tasksId;
      groupTasks.forEach(item => deleteTask(item));
      Groups.splice(i,1);
    } 
  });
}


function dismissGroup(groupId) {
  const group = getObject(Groups,groupId);
  group.studentsId.forEach(id => {
    getObject(Students,id).groupId = 0;
  })
  group.studentsId = [];
}


function addStudentToGroup(studentId,groupId) {
  const group = getObject(Groups,groupId);
  const student = getObject(Students,studentId);
  group.studentsId.push(studentId);
  student.groupId = groupId;
}


function expelStudentFromGroup(studentId,groupId) {
  const group = getObject(Groups,groupId);
  const student = getObject(Students,studentId);
  group.studentsId = group.studentsId.filter(elem => elem !== studentId);
  student.groupId = 0;
}


function addTask(taskName,details,authorId,isGroup) {
  Tasks.push({
    id: Tasks.counter + 1,
    name: taskName,
    details: details,
    rating: 0,
    studentId: 0,
    groupId: 0
  });
  const currentTask = getObject(Tasks, Tasks.counter+1);
  if (isGroup) {
    currentTask.groupId = authorId;
    getObject(Groups, authorId).tasksId.push(currentTask.id);
  }
  else {
    currentTask.studentId = authorId;
    getObject(Students, authorId).tasksId.push(currentTask.id);
  }
  Tasks.counter++;
}


function deleteTask(taskId) {
  Tasks.forEach((elem,i) => {
    if (elem.id === Number(taskId)) Tasks.splice(i,1);
  });
}


function getTaskRating(taskId) {
  return Tasks.filter(elem => elem.id === Number(taskId))[0].rating;
}


function setTaskRating(taskId, newRating) {
  getObject(Tasks, taskId).rating = newRating;
}


function changeValueOfObject(valueKey,obj,elemId,newValue) {
  getObject(obj,elemId)[valueKey] = newValue;
}


function getWishlistOf(obj,elemId) {
  return getObject(obj,elemId).wishList;
}


function getPriorityOfMentor(mentorId, studentId) {
  const wishList = getWishlistOf(Students,studentId);
  return wishList.filter(elem => elem.mentorId === Number(mentorId))[0].priority;
}


function setMentorPriority(mentorId, studentId, value) {
  const wishList = getObject(Students, studentId).wishList;
  wishList.forEach(elem => {
    if (elem.mentorId === Number(mentorId)) elem.priority = value;
  });
}


function getPriorityOfStudent(studentId, mentorId) {
  const wishList = getObject(Mentors, mentorId).wishList;
  return wishList.filter(elem => elem.studentId === Number(studentId))[0].priority;
}


function setStudentPriority(studentId, mentorId, value) {
  const wishList = getObject(Mentors, mentorId).wishList;
  wishList.forEach(elem => {
    if (elem.studentId === Number(studentId)) elem.priority = value;
  });
}


function collectSynergy() {
  Mentors.forEach(elem => {
    if (elem.id) {
      const wishList = getWishlistOf(Mentors, elem.id);
      wishList.forEach(item => {
        item.synergy = item.priority + getPriorityOfMentor(elem.id, item.studentId);
      });
    }
  });
}


function clearAll() {
  Students = [];
  Groups = [];
  Tasks = [];
  Mentors = [];
  Students.counter = Groups.counter = Tasks.counter = Mentors.counter = 0;
}

function setRandPriority() {
  for (let n in Mentors) {
    if (Mentors[n].name) {
      Mentors[n].wishList = [];
      for (let k in Students) {
        if (Students[k].name) {
          Mentors[n].wishList.push({studentId:Students[k].id,priority: Math.floor(Math.random() * 10) + 1});
        }
      }
    }
  }
  for (let n in Students) {
    if (Students[n].name) {
      Students[n].wishList = [];
      for (let k in Mentors) {
        if (Mentors[k].name) {
          Students[n].wishList.push({mentorId:Mentors[k].id,priority: Math.floor(Math.random() * 10) + 1});
        }
      }
    }
  }
  console.log("Priorities have been set");
}


// function getMentorPopularity(mentorId) { // POPULARITY
//   let mentorPopularity = [];
//   let wishList;
//   for (let elem in Students) {
//     if (Students[elem].id) wishList = getWishlistOf(Students,Students[elem].id);
//     for (let item in wishList) {
//       if (wishList[item].mentorId === mentorId) mentorPopularity.push(wishList[item].priority);
//     }
//   }
//   mentorPopularity = mentorPopularity.reduce((sum,item) => sum+item);
//   return mentorPopularity;
// }


function sortStudents() {
  Mentors.forEach(elem => {
    elem.list = [];
  })
  
  let array = [];
  
  for (let elem in Mentors) {
    if (Mentors[elem].wishList) {
      const wish = Mentors[elem].wishList;
      for (let id in wish) {
        array.push([wish[id].synergy,Mentors[elem].id,wish[id].studentId]);
      }
    }
  }
  
  array.sort((a,b) => {
    if (a[0] === b[0]) return b[1]-a[1];
    return b[0]-a[0];
  });
  // array.forEach(elem => {
  //   console.log(elem);
  // })
  
  let maxStudentsAtMentor = Math.floor(Students.length / Mentors.length);
  if (Students.length % Mentors.length !== 0) maxStudentsAtMentor++;
  
  let sortedStudents = 0;
  
  while (sortedStudents < Students.length) {
    let nextStudent = array.shift();
    if (nextStudent) {
      getObject(Mentors,nextStudent[1]).list.push(nextStudent[2]);
      array = array.filter(n => {
        if (!(n[2] === nextStudent[2] || getObject(Mentors,n[1]).list.length >= maxStudentsAtMentor)) return n;
      });
      sortedStudents++;
    }
    else break;
  }
}