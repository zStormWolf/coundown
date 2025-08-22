import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Container,
  HStack,
  Badge
} from '@chakra-ui/react';
import confetti from 'canvas-confetti';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isWorkTime, setIsWorkTime] = useState(false);
  const confettiTriggered = useRef(false);

  const triggerConfetti = () => {
    // Confeti desde la izquierda
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0 }
    });
    
    // Confeti desde la derecha
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 1 }
    });
    
    // Confeti desde el centro
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6, x: 0.5 }
      });
    }, 250);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      // Convert to GMT-5 (Colombia/Peru timezone)
      const gmt5Time = new Date(now.getTime() - (5 * 60 * 60 * 1000));
      const currentHour = gmt5Time.getUTCHours();
      
      // Check if it's work time (8 AM to 5 PM)
      if (currentHour >= 8 && currentHour < 17) {
        setIsWorkTime(true);
        
        // Calculate time until 5 PM
        const endOfWork = new Date(gmt5Time);
        endOfWork.setUTCHours(17, 0, 0, 0);
        
        const diff = endOfWork.getTime() - gmt5Time.getTime();
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft({ hours, minutes, seconds });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          
          // Activar confeti cuando termine el horario laboral
          if (!confettiTriggered.current) {
            triggerConfetti();
            confettiTriggered.current = true;
          }
        }
      } else {
        setIsWorkTime(false);
        confettiTriggered.current = false; // Reset para el próximo día
        
        // Calculate time until 8 AM next day or today
        const startOfWork = new Date(gmt5Time);
        
        if (currentHour >= 17) {
          // After 5 PM, calculate for next day 8 AM
          startOfWork.setUTCDate(startOfWork.getUTCDate() + 1);
        }
        
        startOfWork.setUTCHours(8, 0, 0, 0);
        
        const diff = startOfWork.getTime() - gmt5Time.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #52796F, #354F52, #2F3E46, #1A2E35)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="lg" textAlign="center">
        <VStack spacing={8}>
          <Badge
            colorScheme={isWorkTime ? "red" : "green"}
            fontSize="lg"
            px={4}
            py={2}
            borderRadius="full"
          >
            {isWorkTime ? "HORARIO LABORAL" : "FUERA DE HORARIO"}
          </Badge>
          
          <Heading
            size="2xl"
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            {isWorkTime ? "Tiempo restante de trabajo" : "Tiempo para iniciar trabajo"}
          </Heading>
          
          <HStack spacing={8} justify="center">
            <VStack>
              <Box
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(15px)"
                borderRadius="20px"
                p={6}
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              >
                <Text fontSize="6xl" fontWeight="bold" color="white" lineHeight="1">
                  {String(timeLeft.hours).padStart(2, '0')}
                </Text>
              </Box>
              <Text color="white" fontSize="xl" fontWeight="semibold">
                Horas
              </Text>
            </VStack>
            
            <Text fontSize="6xl" color="white" fontWeight="bold">
              :
            </Text>
            
            <VStack>
              <Box
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(15px)"
                borderRadius="20px"
                p={6}
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              >
                <Text fontSize="6xl" fontWeight="bold" color="white" lineHeight="1">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </Text>
              </Box>
              <Text color="white" fontSize="xl" fontWeight="semibold">
                Minutos
              </Text>
            </VStack>
            
            <Text fontSize="6xl" color="white" fontWeight="bold">
              :
            </Text>
            
            <VStack>
              <Box
                bg="rgba(255, 255, 255, 0.15)"
                backdropFilter="blur(15px)"
                borderRadius="20px"
                p={6}
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              >
                <Text fontSize="6xl" fontWeight="bold" color="white" lineHeight="1">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Text>
              </Box>
              <Text color="white" fontSize="xl" fontWeight="semibold">
                Segundos
              </Text>
            </VStack>
          </HStack>
          
          <Text color="whiteAlpha.800" fontSize="lg">
            Horario: 8:00 AM - 5:00 PM (GMT-5)
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
