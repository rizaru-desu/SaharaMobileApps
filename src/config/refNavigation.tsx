import React from 'react';
import {StackActions} from '@react-navigation/native';

export const refNavigation = React.createRef<any>();

export async function navigate({
  route,
  params,
}: {
  route: string;
  params?: Record<string, any>;
}): Promise<void> {
  refNavigation.current?.navigate(route, params);
}

export async function replace({
  route,
  params,
}: {
  route: string;
  params?: Record<string, any>;
}): Promise<void> {
  refNavigation.current?.dispatch(StackActions.replace(route, params));
}

export async function popToTop(): Promise<void> {
  refNavigation.current?.dispatch(StackActions.popToTop());
}

export async function goBack() {
  refNavigation.current?.goBack();
}
