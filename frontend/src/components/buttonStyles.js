import styled from 'styled-components';
import { Button } from '@mui/material';

// Light, modern color palette
// Primary: Indigo/Blue accent, used across the whole app

export const RedButton = styled(Button)`
  && {
    background-color: #ef4444;
    color: white;
    margin-left: 4px;
    &:hover {
      background-color: #dc2626;
      box-shadow: none;
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    background-color: #1e293b;
    color: white;
    margin-left: 4px;
    &:hover {
      background-color: #334155;
      box-shadow: none;
    }
  }
`;

export const DarkRedButton = styled(Button)`
  && {
    background-color: #b91c1c;
    color: white;
    &:hover {
      background-color: #dc2626;
      box-shadow: none;
    }
  }
`;

export const BlueButton = styled(Button)`
  && {
    background-color: #2563eb;
    color: #fff;
    &:hover {
      background-color: #1d4ed8;
    }
  }
`;

export const PurpleButton = styled(Button)`
  && {
    background-color: #6d28d9;
    color: #fff;
    &:hover {
      background-color: #5b21b6;
    }
  }
`;

export const LightPurpleButton = styled(Button)`
  && {
    background-color: #4f46e5;
    color: #fff;
    &:hover {
      background-color: #4338ca;
    }
  }
`;

export const GreenButton = styled(Button)`
  && {
    background-color: #16a34a;
    color: #fff;
    &:hover {
      background-color: #15803d;
    }
  }
`;

export const BrownButton = styled(Button)`
  && {
    background-color: #92400e;
    color: white;
    &:hover {
      background-color: #78350f;
      box-shadow: none;
    }
  }
`;

export const IndigoButton = styled(Button)`
  && {
    background-color: #4338ca;
    color: white;
    &:hover {
      background-color: #3730a3;
      box-shadow: none;
    }
  }
`;
