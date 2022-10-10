import { useColorMode, useTheme } from '@chakra-ui/react'

const useThemeBackground = () => {
  const { colorMode } = useColorMode()
  const theme = useTheme()
  return theme.styles.global({ colorMode }).body.bg
}

export default useThemeBackground
