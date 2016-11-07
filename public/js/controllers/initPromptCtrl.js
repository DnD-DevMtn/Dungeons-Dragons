export default function(mainService, userService) {
  const init = this;

  mainService.getFBUser().then((response) => {
      console.log('FB user response from mainService in init-prompt', response);
      userService.user = response;
  });
}
