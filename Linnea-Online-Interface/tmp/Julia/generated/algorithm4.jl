using LinearAlgebra.BLAS
using LinearAlgebra

"""
    algorithm4(ml24::Array{Float64,1}, ml25::Array{Float64,1}, ml26::Array{Float64,1})

Compute
alpha = (x^T z x^T y).

# Arguments
- `ml24::Array{Float64,1}`: Operand x of size 10.
- `ml25::Array{Float64,1}`: Operand z of size 10.
- `ml26::Array{Float64,1}`: Operand y of size 10.
"""                    
function algorithm4(ml24::Array{Float64,1}, ml25::Array{Float64,1}, ml26::Array{Float64,1})
    # cost: 41 FLOPs
    # x: ml24, full, z: ml25, full, y: ml26, full
    ml27 = Array{Float64}(undef, 1, 1)
    # tmp1 = (x^T z)
    ml27 = BLAS.dot(10, ml24, 1, ml25, 1)

    # x: ml24, full, y: ml26, full, tmp1: ml27, full
    ml28 = Array{Float64}(undef, 1, 1)
    # tmp3 = (x^T y)
    ml28 = BLAS.dot(10, ml24, 1, ml26, 1)

    # tmp1: ml27, full, tmp3: ml28, full
    ml29 = Array{Float64}(undef, 1, 1)
    # tmp8 = (tmp1 tmp3)
    ml29 = ml27 * ml28

    # tmp8: ml29, full
    # alpha = tmp8
    return (ml29)
end