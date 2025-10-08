import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-detailed',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  })

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => this.member.set(data['member']),
    });
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      },
    });
  }
}
