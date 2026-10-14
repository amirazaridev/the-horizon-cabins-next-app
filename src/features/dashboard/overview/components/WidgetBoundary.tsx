"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";

interface WidgetBoundaryProps {
  /** نام ویجت — در پیام خطا و لاگ استفاده می‌شود. */
  name: string;
  children: ReactNode;
}

interface WidgetBoundaryState {
  error: Error | null;
}

export default class WidgetBoundary extends Component<
  WidgetBoundaryProps,
  WidgetBoundaryState
> {
  state: WidgetBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): WidgetBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[dashboard:${this.props.name}] render failed`, error, info);
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <CardDashContainer className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="bg-danger/10 text-danger grid size-11 place-items-center rounded-full">
          <TriangleAlert className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-text text-sm font-semibold">
            نمایش این بخش ناموفق بود
          </h3>
          <p className="text-text-gray text-xs leading-5">
            خطایی در رندر «{this.props.name}» رخ داد. سایر بخش‌های داشبورد
            بدون مشکل کار می‌کنند.
          </p>
        </div>
        <button
          type="button"
          onClick={this.handleRetry}
          className="border-border hover:bg-surface-raised text-text inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors"
        >
          <RotateCcw className="size-3.5" />
          تلاش دوباره
        </button>
      </CardDashContainer>
    );
  }
}
