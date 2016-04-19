$(document).ready(() => {
  
  renderApp();
  
  $(document).on('click','.students__title', onStudentTitleClick);
  $(document).on('click','.mentors__title', onMentorTitleClick);
  $(document).on('mousedown', onMouseDown);
  
  $('.distribution__button').click(onDistributionButtonClick);
  
  $('.options__json-export').click(exportJSON);
  $('.options__set-random').click(setRandPriority);
  $('.options__clear-all').click(onClearAllClick);
  
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