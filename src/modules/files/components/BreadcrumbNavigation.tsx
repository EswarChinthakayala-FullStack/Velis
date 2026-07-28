import React from 'react';
import { motion } from 'framer-motion';
import type { BreadcrumbNode } from '../hooks/useFolderNavigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';

interface BreadcrumbNavigationProps {
  history: BreadcrumbNode[];
  onNavigate: (folderId: string | null) => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  history,
  onNavigate,
}) => {
  return (
    <div className="px-1 py-2 font-mono text-xs select-none">
      <Breadcrumb>
        <BreadcrumbList className="text-xs text-zinc-400">
          {history.map((node, index) => {
            const isLast = index === history.length - 1;

            return (
              <React.Fragment key={node.id || 'root'}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-semibold text-white truncate max-w-[180px]">
                      {node.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(node.id);
                      }}
                      className="hover:text-white transition-colors cursor-pointer text-zinc-400"
                    >
                      <motion.span whileHover={{ scale: 1.02 }} transition={{ duration: 0.1 }}>
                        {node.name}
                      </motion.span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="text-zinc-600 shrink-0" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNavigation;
