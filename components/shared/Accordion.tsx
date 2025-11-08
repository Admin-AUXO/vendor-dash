import React from 'react';
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../ui/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionSingleProps {
  items: AccordionItem[];
  type?: 'single';
  defaultValue?: string;
  className?: string;
}

interface AccordionMultipleProps {
  items: AccordionItem[];
  type: 'multiple';
  defaultValue?: string[];
  className?: string;
}

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/**
 * Accordion Component
 * 
 * Collapsible content sections, commonly used for FAQs
 * 
 * @example
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Question 1', content: 'Answer 1' },
 *     { id: '2', title: 'Question 2', content: 'Answer 2' },
 *   ]}
 *   type="single"
 * />
 */
export function Accordion(props: AccordionProps) {
  const { items, type = 'single', defaultValue, className } = props;
  
  if (type === 'multiple') {
    return (
      <AccordionPrimitive
        type="multiple"
        defaultValue={defaultValue as string[] | undefined}
        className={cn('w-full', className)}
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </AccordionPrimitive>
    );
  }
  
  return (
    <AccordionPrimitive
      type="single"
      defaultValue={defaultValue as string | undefined}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionPrimitive>
  );
}

