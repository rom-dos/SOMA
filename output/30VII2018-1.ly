\version "2.18.2"
  
  upper = \relative c'' {
  \clef treble
  \key c \major
  \time 4/4

      c4 d e f g a b 
  }

  lower = \relative c {
  \clef bass
  \key c \major
  \time 4/4

    r1 |  
  }

  \score {
    \new PianoStaff \with { instrumentName = #"Piano" }
    <<
      \new Staff = "upper" \upper
      \new Staff = "lower" \lower
    >>
    \layout { }
    \midi { }
  }
