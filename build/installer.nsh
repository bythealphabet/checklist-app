!macro customInstall
  ; Check if previous version exists and handle upgrade
  ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "UninstallString"
  ${If} $0 != ""
    DetailPrint "Previous installation detected. Upgrading..."
    ; Don't show uninstall confirmation for upgrades
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "QuietUninstallString" "$0 /S"
  ${EndIf}

  ; Create registry entries for Add/Remove Programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayName" "SolarGard Checklist"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "Publisher" "SolarGard"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "DisplayIcon" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "UninstallString" "$INSTDIR\${UNINSTALL_EXE}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "QuietUninstallString" "$INSTDIR\${UNINSTALL_EXE} /S"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "InstallDate" "${__DATE__}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "HelpLink" "https://github.com/solargard/checklist"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "URLInfoAbout" "https://solargard.com"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "URLUpdateInfo" "https://github.com/solargard/checklist/releases"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "NoRepair" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "EstimatedSize" 150000
  
  ; Register file associations for .sgc (SolarGard Checklist) files
  WriteRegStr HKCR ".sgc" "" "SolarGardChecklist"
  WriteRegStr HKCR "SolarGardChecklist" "" "SolarGard Checklist File"
  WriteRegStr HKCR "SolarGardChecklist\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME},0"
  WriteRegStr HKCR "SolarGardChecklist\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
!macroend

!macro customUnInstall
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}"
  DeleteRegKey HKCR ".sgc"
  DeleteRegKey HKCR "SolarGardChecklist"
  
  ; Note: User data in %APPDATA% is preserved by default
  DetailPrint "User data preserved in AppData folder"
!macroend

!macro customHeader
  ; Custom header for installer
  !define MUI_WELCOMEPAGE_TITLE "SolarGard Checklist Installer"
  !define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of SolarGard Checklist.$\r$\n$\r$\nSolarGard Checklist helps you manage installation checklists for solar products with ease.$\r$\n$\r$\nClick Next to continue."
  
  ; Custom upgrade detection text
  !define MUI_WELCOMEPAGE_TEXT_UPGRADE "This wizard will upgrade your existing SolarGard Checklist installation.$\r$\n$\r$\nYour settings and data will be preserved.$\r$\n$\r$\nClick Next to continue."
!macroend 