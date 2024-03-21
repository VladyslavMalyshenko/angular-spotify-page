import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import {
  IPlaylist,
  PlaylistsService,
} from '../../../../../../services/playlists-service.service';

@Component({
  selector: 'app-create-popout',
  templateUrl: './create-popout.component.html',
  styleUrl: './create-popout.component.scss',
})
export class CreatePopoutComponent {
  @Input() showState?: boolean;
  @Input() playlists?: Observable<IPlaylist[]>;
  @Output() showStateChange = new EventEmitter<boolean>();
  @Output() playlistsChange = new EventEmitter<Observable<IPlaylist[]>>();

  constructor(private playlistService: PlaylistsService) {}

  public imageSrc =
    'https://images.hungama.com/c/1/793/d99/91239770/91239770_300x300.jpg';

  public notOnlySpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const allowed = control.value.trim();
      return !allowed ? { onlySpaces: { value: control.value } } : null;
    };
  }

  public newForm = new FormGroup({
    name: new FormControl('', [Validators.required, this.notOnlySpaces()]),
    description: new FormControl(''),
    image: new FormControl(''),
  });

  public changeShowState(e: any, bypass: boolean = false) {
    if (e.target === e.currentTarget || bypass) {
      this.showState = false;
      this.showStateChange.emit(this.showState);
    }
  }
  public onSubmit() {
    if (this.newForm.valid) {
      const data = this.newForm.value;
      data.image = this.imageSrc;

      this.playlists = this.playlistService.addPlaylist(data);
      this.playlistsChange.emit(this.playlists);
      this.changeShowState({ bypass: true });
    }
  }

  @ViewChild('avatarInput') input?: ElementRef;

  public openInput() {
    if (this.input) {
      this.input.nativeElement.click();
    }
  }

  public readURL(inputValue: any): void {
    if (inputValue.files && inputValue.files[0]) {
      const file = inputValue.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  public ches(e: any) {
    e.currentTarget.classList.toggle('active');
  }
}
