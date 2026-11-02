import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  imports: [],
  standalone: true,
  templateUrl: './info-tooltip.html',
  styleUrl: './info-tooltip.scss',
})
export class InfoTooltip {
  @Input() text = '';
  @Input() tooltipId = `tooltip-${Math.random().toString(36).slice(2)}`;
}
