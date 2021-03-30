import { Component, OnInit } from '@angular/core';
import { IProfileInfo, ProfileChangedMessage } from '@services/auth/authStore';
import { EventBus } from '@services/messaging/EventBus';
import { KnownMessageKeys } from '@services/messaging/EventMessage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: `./app.html`
})

export class AppComponent implements OnInit {
  defaultBrandColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
  profileSubscription: Subscription | null;

  ngOnInit(): void {
    this.profileSubscription = EventBus.instance
      .messages<ProfileChangedMessage>(KnownMessageKeys.ProfileChanged)
      .subscribe((profileMessage) => {
        this.updateProfileData(profileMessage.payload);
      });
  }

  updateProfileData(profile: IProfileInfo | null) {
    const newPrimaryColor = profile?.referrerConfig?.brandColor || this.defaultBrandColor;
    document.documentElement.style.setProperty('--color-primary', newPrimaryColor);
  }
}
