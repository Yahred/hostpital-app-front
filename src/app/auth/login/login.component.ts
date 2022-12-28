import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBt: ElementRef;


  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [JSON.parse(localStorage.getItem('rememberMe') || 'false')]
  });

  constructor( 
    private router: Router, 
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }
  
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
  google.accounts.id.initialize({
      client_id: "598484667757-029g2snce248kn00gujsd5tgbcvbm9ho.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
  });
  google.accounts.id.renderButton(
      this.googleBt.nativeElement,
      { theme: "outline", size: "large" }  
  );

  google.accounts.id.prompt(); // 
  }

  handleCredentialResponse(response: any) {
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        this.ngZone.run(() => this.router.navigateByUrl('/dashboard'));
      })
  }

  login() {
    if(this.loginForm.invalid) return;
    
    this.usuarioService.login(this.loginForm.value)
      .subscribe({
        next: (resp) => {
          if(this.loginForm.get('rememberMe').value){
            localStorage.setItem('email', this.loginForm.get('email').value);
            localStorage.setItem('rememberMe', JSON.stringify(this.loginForm.get('rememberMe').value));
          }else {
            localStorage.removeItem('email');
            localStorage.removeItem('rememberMe');
          }
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          Swal.fire({
            text: err.error.msg,
            icon: 'error'
          });
        }
      })
  }

}
