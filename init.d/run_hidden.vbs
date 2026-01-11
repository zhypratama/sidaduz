If WScript.Arguments.Count >= 1 Then
    Dim WShell
    Set WShell = CreateObject("WScript.Shell")
    ' Run the command hidden (0) and do not wait for it to finish (False)
    WShell.Run WScript.Arguments(0), 0, False
    Set WShell = Nothing
End If
