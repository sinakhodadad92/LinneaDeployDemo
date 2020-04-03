using LinearAlgebra.BLAS
using LinearAlgebra

"""
    algorithm3(ml18::Array{Float64,1}, ml19::Array{Float64,1}, ml20::Array{Float64,1})

Compute
alpha = (x^T z x^T y).

# Arguments
- `ml18::Array{Float64,1}`: Operand x of size 10.
- `ml19::Array{Float64,1}`: Operand z of size 10.
- `ml20::Array{Float64,1}`: Operand y of size 10.
"""                    
function algorithm3(ml18::Array{Float64,1}, ml19::Array{Float64,1}, ml20::Array{Float64,1})
    # cost: 41 FLOPs
    # x: ml18, full, z: ml19, full, y: ml20, full
    ml21 = Array{Float64}(undef, 1, 1)
    # tmp3 = (x^T y)
    ml21 = BLAS.dot(10, ml18, 1, ml20, 1)

    # x: ml18, full, z: ml19, full, tmp3: ml21, full
    ml22 = Array{Float64}(undef, 1, 1)
    # tmp1 = (x^T z)
    ml22 = BLAS.dot(10, ml18, 1, ml19, 1)

    # tmp3: ml21, full, tmp1: ml22, full
    ml23 = Array{Float64}(undef, 1, 1)
    # tmp8 = (tmp1 tmp3)
    ml23 = ml22 * ml21

    # tmp8: ml23, full
    # alpha = tmp8
    return (ml23)
end