import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserCreationStateService } from '../../../core/services/api/user-creation-state.service';

@Component({
  selector: "app-user-data",
  imports: [FormsModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: `./user-data.component.html`,
  styleUrl: "./user-data.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataComponent {
  @Output() stepCompleted = new EventEmitter<any>();

  userForm: FormGroup;
  isSubmitting = false;
  completData = false;

  input1 = { focused: false, hovered: false };
  input2 = { focused: false, hovered: false };
  input3 = { focused: false, hovered: false };
  input4 = { focused: false, hovered: false };
  input5 = { focused: false, hovered: false };
  input6 = { focused: false, hovered: false };

  matchEmailsValidator(emailKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const email = group.get(emailKey);
      const confirm = group.get(confirmKey);

      if (!email || !confirm) return null;

      const emailValue = email.value;
      const confirmValue = confirm.value;

      if (emailValue && confirmValue && emailValue !== confirmValue) {
        confirm.setErrors({ emailMismatch: true });
        return { emailsDoNotMatch: true };
      }

      if (confirm.hasError("emailMismatch")) {
        confirm.setErrors(null);
      }

      return null;
    };
  }

  constructor(
    private fb: FormBuilder,
    private userCreationState: UserCreationStateService
  ) {
    const saved = this.userCreationState.getUserData();

    this.userForm = this.fb.group(
      {
        username: ["", Validators.required],
        given_name: ["", Validators.required],
        family_name: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        confirm_email: ["", [Validators.required, Validators.email]],
        phone: ["", Validators.required],

        connection: ["PoC-Portal-TBK-Comercios"],
        name: [""],
      },
      {
        validators: this.matchEmailsValidator("email", "confirm_email"),
      }
    );

    this.userForm.statusChanges.subscribe(() => {
      const noGroupErrors = !this.userForm.errors?.["emailsDoNotMatch"];
      this.completData = this.userForm.valid && noGroupErrors;
    });

    if (saved) {
      this.userForm.patchValue(saved);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const form = this.userForm.value;
    form.name = `${form.given_name} ${form.family_name}`;

    console.log("Formulario enviado:", form);
    this.stepCompleted.emit(form); // 👈 avisa al padre
  }
}