"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useChat } from '@/src/hooks/useChat';
import ChatMessage from './ChatMessage';

// Rest of the component code...