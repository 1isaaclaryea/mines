import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  let router: Router = inject(Router);

  if(token){
    let decodedToken = jwtDecode(token);
    const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now()/1000 : false;
    if(isExpired){
      router.navigate(['/login']);
    }
  }
  return next(req);
};
