from .base_level import BaseLevel

class Level8(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=8,
            level_desc="The atomic numbers of all periodic table elements in your password must add up to exactly 200. for ex. Tungsten(W) is 74 and Iridium(Ir) is 77. So IrW is 151",
        )
    
    def __init_elements(self):
        """Initialize the periodic table elements dictionary."""
        return {
            "H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,
            "Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 15, "S": 16, "Cl": 17, "Ar": 18,
            "K": 19, "Ca": 20, "Sc": 21, "Ti": 22, "V": 23, "Cr": 24, "Mn": 25, "Fe": 26,
            "Co": 27, "Ni": 28, "Cu": 29, "Zn": 30, "Ga": 31, "Ge": 32, "As": 33, "Se": 34,
            "Br": 35, "Kr": 36, "Rb": 37, "Sr": 38, "Y": 39, "Zr": 40, "Nb": 41, "Mo": 42,
            "Tc": 43, "Ru": 44, "Rh": 45, "Pd": 46, "Ag": 47, "Cd": 48, "In": 49, "Sn": 50,
            "Sb": 51, "Te": 52, "I": 53, "Xe": 54, "Cs": 55, "Ba": 56, "La": 57, "Ce": 58,
            "Pr": 59, "Nd": 60, "Pm": 61, "Sm": 62, "Eu": 63, "Gd": 64, "Tb": 65, "Dy": 66,
            "Ho": 67, "Er": 68, "Tm": 69, "Yb": 70, "Lu": 71, "Hf": 72, "Ta": 73, "W": 74,
            "Re": 75, "Os": 76, "Ir": 77, "Pt": 78, "Au": 79, "Hg": 80, "Tl": 81, "Pb": 82,
            "Bi": 83, "Po": 84, "At": 85, "Rn": 86, "Fr": 87, "Ra": 88, "Ac": 89, "Th": 90,
            "Pa": 91, "U": 92, "Np": 93, "Pu": 94, "Am": 95, "Cm": 96, "Bk": 97, "Cf": 98,
            "Es": 99, "Fm": 100, "Md": 101, "No": 102, "Lr": 103, "Rf": 104, "Db": 105,
            "Sg": 106, "Bh": 107, "Hs": 108, "Mt": 109, "Ds": 110, "Rg": 111, "Cn": 112,
            "Nh": 113, "Fl": 114, "Mc": 115, "Lv": 116, "Ts": 117, "Og": 118
        }
    
    def extract_elements(self, password: str) -> list[str]:
        """
        Extract periodic table element symbols from password.
        Prioritizes 2-letter symbols over 1-letter symbols.
        
        Args:
            password: The password to scan for elements
            
        Returns:
            list[str]: List of element symbols found
        """
        elements = self.__init_elements()
        elements_found = []
        i = 0
        while i < len(password):
            # Check for 2-letter element first
            if i + 2 <= len(password) and password[i:i+2] in elements:
                elements_found.append(password[i:i+2])
                i += 2
            # Then check for 1-letter element
            elif password[i] in elements:
                elements_found.append(password[i])
                i += 1
            else:
                i += 1
        return elements_found
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if atomic numbers of elements in password sum to exactly 200.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if atomic numbers sum to 200, False otherwise
        """
        elements = self.__init_elements()
        elements_found = self.extract_elements(password)
        total_atomic_number = sum(elements[symbol] for symbol in elements_found)
        print(total_atomic_number)
        return total_atomic_number == 200

    def start(self):
        pass
# Create a singleton instance of the level
level = Level8()