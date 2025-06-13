import {Component, ElementRef, OnDestroy, OnInit, Renderer2, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faChartBar,
  faCog,
  faChevronRight,
  faChevronDown,
  faFileAlt,
  faDatabase,
  faUsers,
  faCircle,
  faCaretRight,
  faCaretLeft,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuItem {
  title: string;
  icon: any;
  link?: string;
  isExpanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slideDownUp', [
      state('closed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
      state('open', style({ height: '*', overflow: 'hidden', opacity: 1 })),
      transition('closed <=> open', animate('300ms ease-in-out'))
    ]),
    trigger('sidebarSlide', [
      state('expanded', style({ width: '17rem' })), // 68 * 0.25rem = 17rem
      state('collapsed', style({ width: '3.5rem' })), // 14 * 0.25rem = 3.5rem
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  isCollapsed = signal(false);
  currentMenuTopPosition: number = 1;
  private globalClickUnlistener: (() => void) | undefined = undefined;


  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef) {
    this.collapseSubmenuOnNavigate();
  }

  menuItems = signal<MenuItem[]>([
    {
      title: 'Dashboard',
      icon: faHome,
      link: '/dashboard'
    },
    {
      title: 'PGO',
      icon: faChartBar,
      isExpanded: false,
      children: [
        {
          title: 'PTCAO', link: '/project-division/PTCAO',
          icon: faCircle
        },
        //PGO Pages
        { title: 'PDD', icon: faCircle, link: '/project-division/PDD' },
        { title: 'ICTO', icon: faCircle, link: '/project-division/ICTO' },
        { title: 'RYDO', icon: faCircle, link: '/project-division/RYDO' },
        { title: 'PWO', icon: faCircle, link: '/project-division/PWO' },
        { title: 'PLPP', icon: faCircle, link: '/project-division/PLPP' },
        { title: 'PTLDC', icon: faCircle, link: '/project-division/PTLDC' },
        { title: 'LEDIPO', icon: faCircle, link: '/project-division/LEDIPO' },
        { title: 'GAD', icon: faCircle, link: '/project-division/GAD' },
      ]
    },
    {
      title: 'OPVG',
      icon: faUsers,
      link: '/users'
    },
    {
      title: 'Implementing',
      icon: faDatabase,
      isExpanded: false,
      children: [
        { title: 'PEO', icon: faCircle, link: '/project-division/PEO' },
        { title: 'PIO', icon: faCircle, link: '/project-division/PIO' },
        { title: 'PCO', icon: faCircle, link: '/project-division/PCO' },
        { title: 'OPAG', icon: faCircle, link: '/project-division/OPAG' },
        { title: 'PENRO', icon: faCircle, link: '/project-division/PENRO' },
        { title: 'PSWDO', icon: faCircle, link: '/project-division/PSWDO' },
        { title: 'PHO', icon: faCircle, link: '/project-division/PHO' },
        { title: 'PVO', icon: faCircle, link: '/project-division/PVO' },
      ]
    },
    {
      title: 'Administrative Support',
      icon: faDatabase,
      isExpanded: false,
      children: [
        { title: 'PPDO', icon: faFileAlt, link: '/project-division/PPDO' },
        { title: 'PHRMO', icon: faDatabase, link: '/project-division/PHRMO' },
        { title: 'PGSO', icon: faFileAlt, link: '/project-division/PGSO' },
        { title: 'PTO', icon: faDatabase, link: '/project-division/PTO' },
        { title: 'PACCO', icon: faFileAlt, link: '/project-division/PACCO' },
        { title: 'PBO', icon: faDatabase, link: '/project-division/PBO' },
        { title: 'PLSO', icon: faFileAlt, link: '/project-division/PLSO' },
        { title: 'PSF', icon: faDatabase, link: '/project-division/PSF' },
      ]
    },
    {
      title: 'Account Management',
      icon: faCog,
      link: '/accounts'
    },
    {
      title: 'Settings',
      icon: faCog,
      link: '/settings'
    },
  ]);

  // FontAwesome icons
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faCaretRight = faCaretRight;
  faCaretLeft = faCaretLeft;
  faCaretDown = faCaretDown;

  ngOnInit() {
    this.globalClickUnlistener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.handleClickOutside(event);
    });
  }

  ngOnDestroy() {
    if (this.globalClickUnlistener) {
      this.globalClickUnlistener();
    }
  }

  toggleMenu(menuItem: MenuItem) {
    if (menuItem.children) {
      menuItem.isExpanded = !menuItem.isExpanded;
    }
  }

  handleMenuClick(menuItem: MenuItem, event: MouseEvent) {
    if (this.isCollapsed()) {
      menuItem.isExpanded = !menuItem.isExpanded;
      if (menuItem.isExpanded) {
        this.calculateTopPosition(event);
      }
      event.stopPropagation();
    } else {
      this.toggleMenu(menuItem);
    }
  }


  toggleSidebar() {
    this.isCollapsed.set(!this.isCollapsed());

    if (this.isCollapsed()) {
      this.menuItems().forEach(menu => {
        menu.isExpanded = false;
      });
    }
  }

  collapseSubmenuOnNavigate() {
    this.router.events.subscribe(() => {
      if (this.isCollapsed()) {
        this.menuItems().forEach(menu => {
          menu.isExpanded = false;
        });
      }
    });
  }


  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);

    if (!clickedInside && this.isCollapsed()) {
      this.menuItems().forEach(menu => {
        menu.isExpanded = false;
      });
    }
  }

  handleSubmenuClick() {
    if (this.isCollapsed()) {
      this.menuItems().forEach(menu => {
        menu.isExpanded = false;
      });
    }
  }


  calculateTopPosition(event: MouseEvent): void {
    const clickedButton = event.currentTarget as HTMLElement;
    const buttonRect = clickedButton.getBoundingClientRect();
    this.currentMenuTopPosition = buttonRect.top - 1;
  }

}
