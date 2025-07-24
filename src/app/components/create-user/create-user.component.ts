// user-create.component.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { UserService } from '../../../core/services/api/users.service';
import { UserDataComponent } from '../user-data/user-data.component';


@Component({
  selector: 'app-user-create',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIcon,
    UserDataComponent
  ],
})
export class UserCreateComponent {
  userForm: FormGroup;
  isSubmitting = false;

  @Input() currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      connection: ['PoC-Portal-TBK-Comercios', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      given_name: ['', Validators.required],
      family_name: ['', Validators.required],
      name: [''],
      nickname: [''],
      user_id: [''],
      username: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.userForm.invalid) return;
    this.isSubmitting = true;

    this.userForm.value.name = `${this.userForm.value.given_name} ${this.userForm.value.family_name}`;
    this.userForm.value.user_id = this.userForm.value.username;

    console.log('Formulario enviado:', this.userForm.value);

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => alert('Usuario creado con éxito'),
      error: (err) => alert('Error al crear el usuario: ' + err.message),
      complete: () => (this.isSubmitting = false),
    });
  }

  @Output() verUsuarios = new EventEmitter<void>();

  verUserList() {
    this.verUsuarios.emit();
  }
}
