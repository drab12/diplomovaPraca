export default function prihlasToken() {
    const user =  sessionStorage.getItem('jwt')
      return { Authorization: 'Bearer ' + user};
   
  }