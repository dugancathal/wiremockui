import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { EMPTY_RECORDING, Recording } from '../wiremock/recording'
import { WiremockService } from '../wiremock/wiremock.service'

@Component({
  selector: 'request-show',
  styleUrls: ['./request.component.scss'],
  templateUrl: './show.component.html',
})
export class RequestsShowComponent implements OnInit {
  keys = (obj) => Object.keys(obj || {})
  showJSON = false
  recording: Recording = EMPTY_RECORDING
  private recordingId: string

  constructor(private route: ActivatedRoute, private wiremockService: WiremockService) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params: ParamMap) => {
      this.recordingId = params.get('id')
      return this.wiremockService.recording(this.recordingId)
    })).subscribe((recording: Recording) => {
      this.recording = recording
    })
  }
}