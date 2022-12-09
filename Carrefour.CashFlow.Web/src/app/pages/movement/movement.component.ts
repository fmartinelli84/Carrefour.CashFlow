import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageType } from 'app/core/models/layouts/message-type';
import { MovementType } from 'app/core/models/movement-type';
import { MessageService } from 'app/core/services/layouts/message.service';
import { MovementService } from 'app/core/services/movement.service';
import { BaseModelComponent } from 'app/shared/components/base-model.component';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent extends BaseModelComponent<any[]> {

  public movementType = MovementType;

  constructor(
    changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private movementService: MovementService,
    private activeRoute: ActivatedRoute) {
    super(changeDetector);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.activeRoute.url.subscribe(params => {
      this.load();
    });
  }

  public load(): void {
    this.movementService.getAll().subscribe(data => {
      this.model = data;
    });
  }

  public delete(id: number): void {

    this.movementService.delete(id).subscribe(data => {

      this.movementService.getAll().subscribe(data => {
        this.model = data;

        this.messageService.message.open('Lançamento excluído com sucesso.', MessageType.Success, true);
      });
    });
  }
}
