import {Injectable} from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {ModalService} from './modal.service';
import {Router} from '@angular/router';

@Injectable()
export class WebsocketService {
  constructor(private modalService: ModalService,
              private router: Router) {
  }

  webSocketEndPoint: string = 'http://localhost:5001/ws';
  topic: string = '/topic/greetings';
  user: string = '/user/queue/reply';
  stompClient: any;


  _connect() {
    if (!this.stompClient) {
      console.log('Initialize WebSocket Connection');
      let ws = new SockJS(this.webSocketEndPoint);
      this.stompClient = Stomp.over(ws);
      const _this = this;
      _this.stompClient.connect({}, function (frame) {
        _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        });
        _this.stompClient.subscribe(_this.user, function (sdkEvent) {
          _this.onMessageReceived(sdkEvent);
        });
        //_this.stompClient.reconnect_delay = 2000;
      }, this.errorCallBack);
    }
  };

  _disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log('errorCallBack -> ' + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }

  // _send(message) {
  //   this.stompClient.send('/app/hello', {}, JSON.stringify(message));
  // }
  //
  // _joinBroadcast(message) {
  //   this.stompClient.send('/app/join', {}, JSON.stringify(message));
  // }

  onMessageReceived(message) {
    const objectInMessage = JSON.parse(message.body);
    const keys = Object.keys(objectInMessage);
    if (keys.includes('course')) {
      const course = objectInMessage.course;
      this.modalService.notificationDialog(`New course invitation!`, `You have been invited to course: ${course.title}`, 'open', () => {
        this.router.navigate(['/courses/' + course.id + '/1'])
      })
    }
  }

}
