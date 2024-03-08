import { Box, Stack } from '@mui/material';
import { FC, RefObject, useRef } from 'react';
import NewElectionsButton from './NewElectionsButton';
import useResizeObserver from '@/hooks/useResizeObserver';
import FooterBar from './FooterBar';
import useIsOverlaps from '@/hooks/useIsOverlaps';

interface FooterProps {
  mainRef: RefObject<HTMLElement>;
}

const Footer: FC<FooterProps> = ({ mainRef }) => {
  const [footerRef, footerEntries] = useResizeObserver<HTMLDivElement>();
  const [footerBarRef, footerBarEntries] = useResizeObserver<HTMLDivElement>();
  const buttonRef = useRef<HTMLDivElement>(null);
  const buttonOverlaps = useIsOverlaps({ root: mainRef.current, element: buttonRef.current });

  const marginHeight = buttonOverlaps ? footerEntries[0]?.contentRect.height : footerBarEntries[0]?.contentRect.height;

  return (
    <>
      <Box height={marginHeight} mt={1} />
      <Stack ref={footerRef} direction='column' position='fixed' bottom={0} spacing={1} width='100%'>
        <NewElectionsButton ref={buttonRef} />
        <FooterBar ref={footerBarRef} />
      </Stack>
    </>
  );
};

export default Footer;
